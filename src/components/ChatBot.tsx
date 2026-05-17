"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOT_RESPONSES = [
  "I understand your frustration. Please hold.",
  "Have you tried turning off your citizenship and on again?",
  "Your query has been forwarded to the relevant department (File #404).",
  "Please contact the support helpline: 1800-SUFFER-NOW.",
  "I am unable to assist at this time. Please visit us in person with 47 documents.",
  "Interesting. That sounds like a YOU problem.",
  "Please allow 6-8 business decades for a response.",
  "Your issue is very important to us. We will get back to you in 2047.",
  "ERROR: Empathy module not found.",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "🙏 Namaste Citizen! I am SEVA BOT v0.0.1. How may I FAIL to assist you today?" },
  ]);
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages(m => [...m, { from: "bot", text: reply }]);
      setTyping(false);
    }, 1200 + Math.random() * 1000);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-16 right-4 z-[500] w-14 h-14 rounded-full border-4 border-yellow-400 bg-blue-800 text-2xl shadow-lg float wiggle"
        title="Click for help (won't actually help)"
      >
        🤖
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-36 right-4 z-[500] w-72 border-2 border-black shadow-[6px_6px_0_blue]"
          >
            <div className="window-bar">
              <span>SEVA BOT v0.0.1 (BETA)</span>
              <button className="window-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="bg-[#d4d0c8] flex flex-col h-72">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-2 py-1 max-w-[80%] border border-black ${
                        m.from === "user" ? "bg-blue-600 text-white" : "bg-white text-black"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="px-2 py-1 bg-white border border-black text-xs italic text-gray-500 blink">
                      Bot is typing... (probably not)
                    </div>
                  </div>
                )}
              </div>
              {/* Input */}
              <div className="border-t-2 border-black flex">
                <input
                  className="flex-1 p-1 text-xs border-none outline-none bg-white"
                  placeholder="Type your problem..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                />
                <button onClick={send} className="px-2 bg-blue-800 text-white text-xs font-black border-l-2 border-black">
                  SEND
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
