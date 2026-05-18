"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import SessionTimer from "@/components/SessionTimer";
import UnhingedAd from "@/components/UnhingedAd";

const CITIZEN_NAMES = [
  "Rajesh Kumar", "Priya Sharma", "Amit Singh", "Sunita Devi", "Mohd. Iqbal",
  "Lakshmi Bai", "Vikas Gupta", "Anita Patel", "Suresh Yadav", "Meena Kumari",
  "Ravi Shankar", "Geeta Devi", "Prakash Rao", "Kavita Singh", "Arun Tiwari",
];

const SERVED_REASONS = [
  "Form rejected — wrong shade of blue ink",
  "Form accepted — citizen wept with joy",
  "Form lost — resubmission required",
  "Citizen has left the building",
  "Server reset — position lost",
];

const ANNOUNCEMENTS = [
  "COUNTER 3 IS NOW OPEN (Counter 3 is not open)",
  "Please keep your documents ready (we will reject them anyway)",
  "Citizens speaking loudly will be fined under Noise Tax Act 2023",
  "Free WiFi available — password is your Aadhaar number (it isn't)",
  "Water cooler is broken — has been broken since 2015",
  "Please do not feed the government employees",
  "Token system reset due to cosmic ray interference",
];

export default function QueuePage() {
  const router = useRouter();
  const [queuePos, setQueuePos] = useState(47321);
  const [timeEstimate, setTimeEstimate] = useState("14 years, 3 months");
  const [served, setServed] = useState<{ name: string; reason: string }[]>([]);
  const [announcement, setAnnouncement] = useState(0);
  const [counterStatus, setCounterStatus] = useState([false, false, false, false, false]);
  const [token, setToken] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [progressWidth] = useState(0.1);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);

  // Set client-only values after mount
  useEffect(() => {
    setToken(`TK-${Math.floor(Math.random() * 90000) + 10000}`);
    setIssuedAt(new Date().toLocaleTimeString("en-IN"));
  }, []);

  // Queue slowly goes UP
  useEffect(() => {
    const t = setInterval(() => {
      setQueuePos(p => p + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Citizens "being served" — but it's always someone else
  useEffect(() => {
    const t = setInterval(() => {
      const name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
      const reason = SERVED_REASONS[Math.floor(Math.random() * SERVED_REASONS.length)];
      setServed(prev => [{ name, reason }, ...prev].slice(0, 6));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Rotate announcements
  useEffect(() => {
    const t = setInterval(() => setAnnouncement(a => (a + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Counters randomly open/close
  useEffect(() => {
    const t = setInterval(() => {
      setCounterStatus(prev => prev.map(() => Math.random() > 0.7));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5dc] flex flex-col font-mono text-black relative">

      {/* Floating Unhinged Ads */}
      <UnhingedAd type="floating" />

      {/* Leave alert */}
      <AnimatePresence>
        {showLeaveAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <div className="gov-card max-w-sm w-full mx-4 text-center">
              <div className="text-5xl mb-3">😱</div>
              <h2 className="text-xl font-black text-red-700 mb-2">ARE YOU SURE YOU WANT TO LEAVE?</h2>
              <p className="text-sm mb-4">
                You have been waiting for <strong suppressHydrationWarning>{Math.floor(Math.random() * 200 + 100)} minutes</strong>.<br />
                Leaving will forfeit your token <strong>{token}</strong>.<br />
                <span className="text-[10px] text-gray-500">It will take 3–5 years to get a new one.</span>
              </p>
              <div className="flex gap-2">
                <button className="gov-btn flex-1 text-sm" onClick={() => setShowLeaveAlert(false)}>
                  STAY (RECOMMENDED)
                </button>
                <button
                  className="gov-btn-secondary flex-1 text-sm"
                  onClick={() => router.push("/dashboard")}
                >
                  GIVE UP
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#1a237e] text-white p-4 border-b-4 border-yellow-400 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black uppercase">🏢 NATIONAL QUEUE MANAGEMENT SYSTEM</h1>
          <p className="text-[10px] text-blue-300">Authorised under SUFFER-ACT 2023 | Version 0.0.1</p>
        </div>
        <div className="flex items-center gap-4">
          <SessionTimer />
          <button onClick={() => setShowLeaveAlert(true)} className="gov-btn-secondary text-xs py-1">
            ← BACK (LOSE POSITION)
          </button>
        </div>
      </header>

      {/* Announcement LED board */}
      <div className="bg-black text-red-500 py-2 overflow-hidden font-black text-sm border-b-4 border-red-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={announcement}
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="whitespace-nowrap inline-block"
          >
            📢 {ANNOUNCEMENTS[announcement]} &nbsp;&nbsp;&nbsp; 📢 {ANNOUNCEMENTS[(announcement + 1) % ANNOUNCEMENTS.length]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1 p-6 grid grid-cols-3 gap-6">

        {/* Token display - big */}
        <div className="col-span-2 space-y-4">
          {/* Current token */}
          <div className="bg-[#1a237e] text-white border-4 border-yellow-400 p-6 text-center">
            <p className="text-xs font-bold uppercase text-blue-300 mb-1">YOUR TOKEN NUMBER</p>
            <div className="text-8xl font-black text-yellow-400 tracking-widest blink">{token || "TK-????"}</div>
            <p className="text-xs text-blue-300 mt-2">Issued at {issuedAt || "--:--:--"} — Do not lose this. We don't have a reprint machine.</p>
          </div>

          {/* Queue position */}
          <div className="bg-white border-4 border-black p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Current Queue Position</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-red-700">{queuePos.toLocaleString("en-IN")}</span>
                  <span className="text-red-500 text-sm mb-1 blink">▲ and rising</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase">Estimated Wait</p>
                <p className="text-xl font-black text-red-700">{timeEstimate}</p>
                <p className="text-[9px] text-gray-400">(subject to change upwards)</p>
              </div>
            </div>

            {/* Progress bar — stuck at 0.1% */}
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Your progress through the queue:</p>
              <div className="w-full bg-gray-300 h-5 border-2 border-black relative overflow-hidden">
                <div className="bg-green-600 h-full" style={{ width: `${progressWidth}%` }}></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                  {progressWidth}% — ESSENTIALLY ZERO
                </span>
              </div>
            </div>
          </div>

          {/* Counter status board */}
          <div className="bg-gray-800 text-white p-4 border-2 border-gray-600">
            <h3 className="text-sm font-black mb-3 text-yellow-400">COUNTER STATUS BOARD</h3>
            <div className="grid grid-cols-5 gap-2">
              {counterStatus.map((open, i) => (
                <div key={i} className={`p-3 border-2 text-center text-xs ${open ? "bg-green-700 border-green-400" : "bg-red-900 border-red-600"}`}>
                  <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${open ? "bg-green-400" : "bg-red-500"} ${open ? "animate-pulse" : ""}`}></div>
                  <p className="font-black">CTR {i + 1}</p>
                  <p className="text-[8px]">{open ? "OPEN" : "CLOSED"}</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-2 text-center">Counter status changes randomly. This is normal.</p>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* "Now serving" live feed */}
          <div className="bg-white border-4 border-black">
            <div className="window-bar">
              <span>NOW SERVING (not you)</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="p-3 space-y-2 max-h-64 overflow-hidden">
              <AnimatePresence>
                {served.map((s, i) => (
                  <motion.div
                    key={`${s.name}-${i}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="text-xs border-b border-gray-200 pb-1"
                  >
                    <span className="font-bold">{s.name}</span>
                    <span className="text-gray-500 text-[9px] block">{s.reason}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {served.length === 0 && (
                <p className="text-xs text-gray-400 italic">No one has been served today.</p>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-100 border-4 border-yellow-600 p-3">
            <h3 className="font-black text-sm mb-2 text-yellow-800">💡 QUEUE TIPS:</h3>
            <ul className="text-[9px] space-y-1 text-gray-700">
              <li>• Do not go to the bathroom. You will lose your token.</li>
              <li>• Eating in the queue is taxable (Queue-Snack Act 2022).</li>
              <li>• Tokens are non-transferable, non-refundable, and non-functional.</li>
              <li>• Queue number is assigned randomly. Yours is random.</li>
              <li>• Arguing with staff will move you to position 1,00,000.</li>
            </ul>
          </div>

          {/* Entertainment banner ad replacement */}
          <div className="bg-[#000080] p-1 border-2 border-yellow-400">
            <UnhingedAd type="sidebar" />
          </div>

          {/* Clock */}
          <div className="bg-black text-green-400 font-mono p-3 border-2 border-green-600 text-center">
            <p className="text-[9px] text-gray-500 mb-1">OFFICE HOURS:</p>
            <p className="text-xs">Mon–Fri: 10am–10:15am</p>
            <p className="text-xs">Sat: By appointment only</p>
            <p className="text-xs text-red-400">Currently: CLOSED</p>
            <p className="text-[8px] text-gray-600 mt-1">*Open during the office hours of being open</p>
          </div>
        </div>
      </div>

      <ChatBot />

      <footer className="bg-[#1a237e] text-[8px] text-center text-blue-300 py-2">
        NATIONAL QUEUE MANAGEMENT SYSTEM v1.0 | THIS IS NOT A SIMULATION (IT IS) | © MINISTRY OF WAITING
      </footer>
    </div>
  );
}
