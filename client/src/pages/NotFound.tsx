import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-hidden text-white px-4">
      
      {/* ตัวเลข 404 ใหญ่แบบ 4D */}
      <div className="text-[9rem] font-extrabold relative z-10 leading-none tracking-wider select-none">
        <span className="text-white drop-shadow-lg animate-pulse">4</span>
        <span className="text-indigo-400 drop-shadow-lg animate-bounce">0</span>
        <span className="text-white drop-shadow-lg animate-pulse">4</span>
      </div>

      {/* ข้อความประกอบ */}
      <p className="text-xl mt-4 text-center z-10">โอ๊ะ! ไม่พบหน้าที่คุณกำลังค้นหา 😢</p>

      {/* ปุ่มกลับหน้าหลัก */}
      <Link
        to="/"
        className="mt-6 z-10 inline-block px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-lg"
      >
        กลับหน้าหลัก
      </Link>

      {/* เอฟเฟกต์ลูกกลมแบบ 4D */}
      <div className="absolute w-[300px] h-[300px] bg-purple-600 opacity-30 blur-3xl rounded-full animate-[float_10s_ease-in-out_infinite] top-10 left-10"></div>
      <div className="absolute w-[250px] h-[250px] bg-indigo-400 opacity-40 blur-2xl rounded-full animate-[float_14s_ease-in-out_infinite] top-[60%] left-[70%]"></div>
      <div className="absolute w-[200px] h-[200px] bg-pink-400 opacity-30 blur-2xl rounded-full animate-[float_18s_ease-in-out_infinite] top-[80%] left-[20%]"></div>

      {/* Keyframes ผ่าน Tailwind */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
          }
        `}
      </style>
    </div>
  )
}
