import { useState } from "react"
import Swal from "sweetalert2"

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
  switchToRegister: () => void
  onLoginSuccess: (user: { username: string; email: string }) => void
}


export default function LoginModal({ isOpen, onClose, switchToRegister, onLoginSuccess }: LoginModalProps) {
  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.username || !form.password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: data.error || "เข้าสู่ระบบไม่สำเร็จ",
        })
        } else {
        const userData = {
            username: data.username,
            email: data.email,
        }

        onLoginSuccess(userData) // เรียกตรงนี้เมื่อ login สำเร็จ

        Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            text: `ยินดีต้อนรับ ${data.username}`,
            timer: 2000,
            showConfirmButton: false,
        })

        onClose()
    }

    } catch (err) {
      console.error("Login error:", err)
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
        text: "โปรดลองใหม่ภายหลัง",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white w-full max-w-md p-6 rounded-xl shadow-2xl relative border border-gray-700">
        <h2 className="text-xl font-bold text-indigo-400 mb-4 text-center">เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="ชื่อผู้ใช้"
            className="w-full bg-gray-800 px-4 py-2 rounded-md border border-gray-600 focus:ring"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full bg-gray-800 px-4 py-2 rounded-md border border-gray-600 focus:ring"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-300">
          ยังไม่มีบัญชี?{" "}
          <button onClick={switchToRegister} className="text-indigo-400 hover:underline">
            สมัครสมาชิก
          </button>
        </p>
        <button onClick={onClose} className="absolute top-2 right-3 text-xl text-gray-400 hover:text-white">✖</button>
      </div>
    </div>
  )
}
