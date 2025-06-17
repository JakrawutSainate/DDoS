import Swal from "sweetalert2"

type LogoutModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  if (!isOpen) return null

  const handleLogout = () => {
    localStorage.removeItem("user")
    Swal.fire({
      icon: "success",
      title: "ออกจากระบบแล้ว",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      onClose()
      window.location.reload()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 w-full max-w-md text-white">
        <h2 className="text-xl font-bold text-indigo-400 mb-4 text-center">ยืนยันออกจากระบบ</h2>
        <p className="text-center mb-6 text-slate-300">คุณต้องการออกจากระบบหรือไม่?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700">ยกเลิก</button>
          <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 font-semibold">ออกจากระบบ</button>
        </div>
      </div>
    </div>
  )
}
