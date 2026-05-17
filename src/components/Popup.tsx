"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface PopupProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  initialX?: number;
  initialY?: number;
  tinyClose?: boolean;
}

export default function Popup({ title, children, onClose, initialX = 40, initialY = 40, tinyClose = false }: PopupProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{ position: "fixed", zIndex: 9000, width: 260, cursor: "grab" }}
      className="select-none"
    >
      <div className="border-2 border-black shadow-[6px_6px_0_red]">
        {/* Title bar */}
        <div className="window-bar">
          <span className="truncate">{title}</span>
          <button
            onClick={onClose}
            className="window-close"
            title="close"
            style={tinyClose ? { width: 8, height: 8, fontSize: 5 } : {}}
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="bg-[#d4d0c8] p-3 text-black text-xs">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
