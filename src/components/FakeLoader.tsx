"use client";
import { useState, useEffect } from "react";

interface FakeLoaderProps {
  onComplete?: () => void;
  messages?: string[];
  durationMs?: number;
}

const DEFAULT_MESSAGES = [
  "Connecting to National Server...",
  "Verifying Aadhaar linkage...",
  "Checking CIBIL score...",
  "Validating DNA sequence...",
  "Contacting District Collector...",
  "Uploading your data to China...",
  "Reversing upload... (just kidding)",
  "Performing mandatory bureaucratic delay...",
  "Almost there...",
  "JUST KIDDING. Starting over.",
];

export default function FakeLoader({ onComplete, messages = DEFAULT_MESSAGES, durationMs = 7000 }: FakeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      // randomly stall or go backwards
      const delta = Math.random() > 0.15 ? Math.random() * 4 : -Math.random() * 2;
      p = Math.min(99, Math.max(0, p + delta));
      setProgress(Math.round(p));
    }, 120);

    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % messages.length);
    }, 900);

    const stuckTimer = setTimeout(() => {
      setStuck(true);
      clearInterval(interval);
    }, durationMs - 1500);

    const doneTimer = setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
      clearTimeout(stuckTimer);
      clearTimeout(doneTimer);
    };
  }, [durationMs, messages, onComplete]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
      <div className="crt-screen w-full max-w-md scanlines">
        <div className="mb-4 text-center">
          <div className="text-2xl font-black mb-1 blink">⚠ SYSTEM PROCESSING ⚠</div>
          <div className="text-xs opacity-70">DO NOT CLOSE THIS WINDOW OR BLOW ON THE SCREEN</div>
        </div>

        {/* Progress bar */}
        <div className="border-2 border-green-500 h-6 relative mb-2 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-black mix-blend-difference">
            {stuck ? "99% (stuck)" : `${progress}%`}
          </span>
        </div>

        <div className="text-xs mb-4 type-cursor pr-1 min-h-[1.5rem]">
          &gt; {messages[msgIdx]}
        </div>

        <div className="text-[10px] opacity-50 space-y-1" suppressHydrationWarning>
          <div>CPU: {Math.floor(Math.random() * 40 + 60)}% | RAM: {Math.floor(Math.random() * 30 + 70)}%</div>
          <div>NATIONAL_SERVER_PING: {Math.floor(Math.random() * 2000 + 500)}ms</div>
          {stuck && <div className="text-red-400 blink">⚠ PACKET LOSS: 98% — RETRYING...</div>}
        </div>
      </div>
    </div>
  );
}
