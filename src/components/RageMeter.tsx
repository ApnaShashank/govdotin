"use client";

interface RageMeterProps {
  value: number; // 0–100
}

export default function RageMeter({ value }: RageMeterProps) {
  const emoji =
    value < 20 ? "😊" :
    value < 40 ? "😕" :
    value < 60 ? "😤" :
    value < 80 ? "😡" : "🤯";

  const label =
    value < 20 ? "NAIVE" :
    value < 40 ? "ANNOYED" :
    value < 60 ? "FRUSTRATED" :
    value < 80 ? "RAGING" : "SUFFERING";

  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      <div className="flex justify-between text-[10px] font-black text-yellow-300">
        <span>CITIZEN STRESS</span>
        <span>{emoji} {label}</span>
      </div>
      <div className="h-4 bg-gray-800 border border-yellow-400 relative overflow-hidden">
        <div
          className="rage-bar-fill h-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
        {value >= 80 && (
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white blink">
            CALL YOUR MLA
          </div>
        )}
      </div>
      <div className="text-[8px] text-gray-400 text-right">{value}/100</div>
    </div>
  );
}
