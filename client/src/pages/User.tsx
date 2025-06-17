import Sidebar from "../components/Sidebar"

export default function User() {
  return (
    <div className="min-h-screen flex bg-gray-900 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 pt-[72px] md:pt-10">
        <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl shadow-xl backdrop-blur-md border border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-300 mb-6">👤 ข้อมูลผู้ใช้งาน</h1>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">ชื่อผู้ใช้</label>
              <input
                type="text"
                placeholder="ชื่อของคุณ"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">อีเมล</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-md shadow-md transition"
            >
              💾 บันทึกข้อมูล
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
