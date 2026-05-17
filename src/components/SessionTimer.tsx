"use client";
import { useState, useEffect } from "react";

export default function SessionTimer({ onExpire }: { onExpire?: () => void }) {
  const [seconds, setSeconds] = useState(30);
  const [panicking, setPanicking] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    if (seconds <= 10) setPanicking(true);
    return () => clearTimeout(t);
  }, [seconds, onExpire]);

  const reset = () => {
    setSeconds(30);
    setPanicking(false);
  };

  return (
    <button
      onClick={reset}
      title="Click to extend session (resets to 30s)"
      className={`text-[10px] font-black px-2 py-1 border-2 border-yellow-400 ${
        panicking ? "bg-red-700 text-white blink" : "bg-black text-yellow-300"
      }`}
    >
      ⏱ SESSION: {String(Math.floor(seconds / 60)).padStart(2, "0")}:
      {String(seconds % 60).padStart(2, "0")}
      {panicking ? " ⚠ CLICK NOW!" : ""}
    </button>
  );
}
