import Sidebar from "../components/Sidebar"

export default function About() {
  return (
    <div className="min-h-screen flex bg-gray-900 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 pt-[72px] md:pt-10">
        <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-xl shadow-xl backdrop-blur-md border border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-300 mb-4">ℹ️ เกี่ยวกับระบบ</h1>
          <p className="text-slate-300 mb-4">
            ระบบนี้ใช้โมเดล Deep Learning ประเภท <strong>LSTM</strong> เพื่อทำการจำแนกการโจมตีแบบ DDoS
            โดยอิงจากชุดข้อมูล <code>cicddos2019_dataset.csv</code>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-200">
            <li>✅ จำแนกการโจมตีได้หลายประเภท เช่น UDP, TCP, HTTP, WebDDoS</li>
            <li>🧠 ใช้ TensorFlow/Keras สำหรับสร้างและเทรนโมเดล</li>
            <li>🌐 เชื่อมต่อผ่าน WebSocket เพื่อรับข้อมูลเรียลไทม์</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
