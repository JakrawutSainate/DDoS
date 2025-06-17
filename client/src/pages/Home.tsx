// src/pages/Home.tsx
import Sidebar from "../components/Sidebar"

export default function Home() {
  return (
    <div className="min-h-screen flex bg-gray-900 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 relative z-10 pt-[72px] md:pt-10">
        <div className="bg-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-indigo-300">
            DDoS Detection Dashboard
          </h1>
          <p className="text-slate-200 mb-6">
            ระบบพร้อมรอการเชื่อมต่อ WebSocket เพื่อตรวจจับการโจมตี
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-md shadow-lg transition-all"
          >
            รีเฟรชหน้า
          </button>
        </div>

        <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-purple-600 opacity-20 blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-pink-500 opacity-20 blur-2xl animate-[float_18s_ease-in-out_infinite]"></div>

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
            }
          `}
        </style>
      </main>
    </div>
  )
}
