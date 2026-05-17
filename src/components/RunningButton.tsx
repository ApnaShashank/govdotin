"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface RunningButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  maxEscapes?: number;
}

export default function RunningButton({ children, onClick, className = "", maxEscapes = 7 }: RunningButtonProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [escapes, setEscapes] = useState(0);
  const [shrinking, setShrinking] = useState(false);

  const escape = () => {
    if (escapes >= maxEscapes) {
      // Give up and let them click
      return;
    }
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 120;
    setPos(p => ({ x: p.x + Math.cos(angle) * dist, y: p.y + Math.sin(angle) * dist }));
    setEscapes(e => e + 1);
    if (escapes === maxEscapes - 1) {
      setShrinking(true);
      setTimeout(() => setShrinking(false), 1500);
    }
    // Play buzz via Web Audio API
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  return (
    <motion.button
      animate={{ x: pos.x, y: pos.y, scale: shrinking ? 0.3 : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      onMouseEnter={escape}
      onClick={onClick}
      className={`relative z-50 ${className}`}
    >
      {escapes >= maxEscapes && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-green-600 font-black whitespace-nowrap">
          Fine. You can click now. 😒
        </span>
      )}
      {children}
    </motion.button>
  );
}
