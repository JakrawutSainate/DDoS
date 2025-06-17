import { Link, useLocation } from "react-router-dom"
import { clsx } from "clsx"
import { useState, useEffect } from "react"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import Swal from "sweetalert2"

export default function Sidebar() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [modal, setModal] = useState<false | "login" | "register">(false)
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLoginSuccess = (userData: { username: string; email: string }) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setModal(false)
  }

  const handleLogout = () => {
    Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user")
        setUser(null)
        Swal.fire({
          icon: "success",
          title: "ออกจากระบบแล้ว",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/about", label: "เกี่ยวกับระบบ" },
    { path: "/live", label: "Live Monitor" },
  ]

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center bg-gray-900 text-white border-b border-gray-700 shadow-md">
        <h1 className="text-lg font-bold text-indigo-300">AI Monitor</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">📋</button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="w-64 min-h-screen relative bg-white/5 backdrop-blur-md border-r border-gray-800 shadow-xl p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-10 text-indigo-400 tracking-wide">AI Monitor</h2>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "block px-4 py-3 rounded-lg text-white hover:bg-indigo-600/20 transition-all",
                location.pathname === item.path && "bg-indigo-600/30 text-indigo-300 font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          {user ? (
            <div className="text-center space-y-2">
              <p className="text-indigo-300">👋 ยินดีต้อนรับ {user.username}</p>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModal("login")}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-md"
            >
              เข้าสู่ระบบ
            </button>
          )}
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex">
          <aside className="w-64 bg-gray-900 text-white p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-indigo-300">AI Monitor</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-xl">✖</button>
            </div>

            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "block px-4 py-2 rounded-md hover:bg-indigo-600/20",
                    location.pathname === item.path && "bg-indigo-600/30 text-indigo-300 font-semibold"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              {user ? (
                <div className="text-center space-y-2">
                  <p className="text-indigo-300">👋 {user.username}</p>
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false)
                      handleLogout()
                    }}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSidebarOpen(false)
                    setModal("login")
                  }}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold"
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={modal === "login"}
        onClose={() => setModal(false)}
        switchToRegister={() => setModal("register")}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal
        isOpen={modal === "register"}
        onClose={() => setModal(false)}
        switchToLogin={() => setModal("login")}
      />
    </>
  )
}
