import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const typeColor = {
  UDP: "bg-red-600",
  TCP: "bg-yellow-500",
  WebDDoS: "bg-purple-500",
  TFTP: "bg-pink-500",
  BENIGN: "bg-green-600",
} as const;

type AttackType = keyof typeof typeColor;

type Attack = {
  id: number;
  type: AttackType;
  confidence: number;
  time: string;
};

type AttackResponse = {
  id: number;
  type: string;
  confidence: number;
};

export default function Live() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch attacks from API
  useEffect(() => {
    const fetchInitialAttacks = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/attackall");
        const data = await res.json();

        const now = new Date();
        const timeStr = now.toLocaleTimeString("th-TH", { hour12: false });

        const formatted: Attack[] = (data as AttackResponse[]).map((item) => ({
          id: item.id,
          type: item.type as AttackType,
          confidence: item.confidence,
          time: timeStr,
        }));

        setAttacks(formatted);
      } catch (err) {
        console.error("Failed to fetch attack history", err);
      }
    };

    fetchInitialAttacks();
  }, []);

  // WebSocket listener
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      try {
        const raw = event.data as string;
        const now = new Date();
        const timeStr = now.toLocaleTimeString("th-TH", { hour12: false });

        const match = raw.match(/: (\w+) \(([\d.]+)\)/);
        if (match) {
          const type = match[1] as AttackType;
          const confidence = parseFloat(match[2]);

          toast.success(
            `โจมตีใหม่: ${type} (${(confidence * 100).toFixed(1)}%)`,
            {
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#a5b4fc",
                border: "1px solid #4f46e5",
              },
            }
          );

          setAttacks((prev) => [
            {
              id: Date.now(),
              type,
              confidence,
              time: timeStr,
            },
            ...prev,
          ]);
        }
      } catch (err) {
        console.error("WebSocket parse error", err);
      }
    };

    return () => socket.close();
  }, []);

  // Predict test
  const handleTestAI = async () => {
    const mockFeatures = Array(78)
      .fill(0)
      .map(() => Math.random());

    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: mockFeatures }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "พยากรณ์ไม่สำเร็จ");
    } catch (err: unknown) {
      console.error("Predict Error:", err);
      if (err instanceof Error) {
        alert("เกิดข้อผิดพลาด: " + err.message);
      } else {
        alert("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
      }
    }
  };

  // Pagination logic
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentPageData = attacks.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(attacks.length / itemsPerPage);

  return (
    <div className="min-h-screen flex bg-gray-900 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-8 pt-[72px] md:pt-10 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-indigo-300 mb-6">
            Live Attack Monitor
          </h1>

          <button
            onClick={handleTestAI}
            className="mb-6 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 font-semibold text-white"
          >
            ทดสอบโจมตี (AI)
          </button>

          {attacks.length === 0 ? (
            <p className="text-slate-400">ไม่มีข้อมูลการโจมตี ณ ตอนนี้</p>
          ) : (
            <>
              <div className="space-y-4">
                {currentPageData.map((attack) => (
                  <div
                    key={attack.id}
                    className="flex justify-between items-center px-4 py-3 rounded-lg shadow-md border border-gray-700 bg-white/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full ${typeColor[attack.type]}`}
                      />
                      <div>
                        <p className="font-semibold text-lg">{attack.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">ความมั่นใจ</p>
                      <p className="text-xl font-bold text-indigo-400">
                        {(attack.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-30"
                >
                  ◀ ก่อนหน้า
                </button>
                <span className="text-slate-300">
                  หน้า {currentPage} จาก {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-30"
                >
                  ถัดไป ▶
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
