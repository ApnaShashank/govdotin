"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import UnhingedAd from "@/components/UnhingedAd";

const SHUFFLED_NUMPAD = [7, 3, 1, 9, 5, 0, 4, 8, 2, 6];

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5]);
  const [timer, setTimer] = useState(0); // counts UP — adds panic
  const [resendVisible, setResendVisible] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [upsideDownIdx, setUpsideDownIdx] = useState(2); // one box flipped
  const [attempts, setAttempts] = useState(0);
  const [shakeAll, setShakeAll] = useState(false);
  const [success, setSuccess] = useState(false);
  const [numpadOrder, setNumpadOrder] = useState(SHUFFLED_NUMPAD);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Shuffle positions every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setPositions(p => [...p].sort(() => Math.random() - 0.5));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Timer counts UP
  useEffect(() => {
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Randomly move the upside-down box
  useEffect(() => {
    const t = setInterval(() => {
      setUpsideDownIdx(Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Resend button flash briefly
  useEffect(() => {
    const flash = setInterval(() => {
      setResendVisible(true);
      setTimeout(() => setResendVisible(false), 300);
    }, 8000);
    return () => clearInterval(flash);
  }, []);

  // Shuffle numpad every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setNumpadOrder(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleInput = (posIdx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const originalIdx = positions[posIdx];
    const newOtp = [...otp];
    newOtp[originalIdx] = digit;
    setOtp(newOtp);
  };

  const handleNumpadPress = (digit: number) => {
    const firstEmpty = positions.findIndex(originalIdx => otp[originalIdx] === "");
    if (firstEmpty === -1) return;
    const originalIdx = positions[firstEmpty];
    const newOtp = [...otp];
    newOtp[originalIdx] = String(digit);
    setOtp(newOtp);
  };

  const handleClear = () => setOtp(["", "", "", "", "", ""]);

  const handleSubmit = () => {
    const entered = positions.map(i => otp[i]).join("");
    setAttempts(a => a + 1);
    if (entered === "123456") {
      setSuccess(true);
      setTimeout(() => router.push("/apply/income-certificate"), 2000);
    } else {
      setShakeAll(true);
      setTimeout(() => setShakeAll(false), 600);
      alert(
        attempts < 2
          ? "WRONG OTP. The National Server has determined your fingers are lying."
          : attempts < 4
          ? "STILL WRONG. Please note: we sent the OTP to your childhood phone number."
          : "FINAL WARNING: One more wrong attempt and your Aadhaar will be linked to a buffalo."
      );
    }
  };

  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#1a237e] flex flex-col items-center justify-center p-6 relative">

      {/* Floating Unhinged Ads */}
      <UnhingedAd type="floating" />

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-green-700 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <div className="text-8xl mb-4 float">✅</div>
              <h2 className="text-4xl font-black">OTP ACCEPTED</h2>
              <p className="text-sm mt-2 opacity-70">Redirecting to more suffering...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-1">
          Step 3 of 6 — OTP Verification
        </div>
        <h1 className="text-3xl font-black text-white">CRITICAL OTP VERIFICATION</h1>
        <p className="text-blue-300 text-sm mt-1">
          We sent a 6-digit code to your primary school landline.<br />
          Please ensure it is plugged in.
        </p>
      </div>

      {/* Main card */}
      <div className="gov-card w-full max-w-lg">

        {/* Timer — counts UP */}
        <div className={`flex justify-between items-center mb-4 text-sm ${timer > 60 ? "text-red-600 blink" : "text-gray-700"}`}>
          <span className="font-bold text-xs text-gray-500 uppercase">Time elapsed (panic accordingly):</span>
          <span className="font-black text-xl tabular-nums">{mins}:{secs} ⬆</span>
        </div>

        {/* OTP boxes — shuffled positions */}
        <div className="mb-2">
          <p className="text-[10px] text-gray-500 italic mb-3 text-center">
            ⚠ Boxes shuffle every 2.5 seconds to prevent automation. Box #{upsideDownIdx + 1} is also upside-down.
          </p>
          <div className="flex justify-center gap-2">
            {positions.map((originalIdx, posIdx) => (
              <motion.div
                key={originalIdx}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <input
                  ref={el => { inputRefs.current[posIdx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[originalIdx]}
                  onChange={e => handleInput(posIdx, e.target.value)}
                  className={`w-12 h-14 text-center text-2xl font-black border-4 border-black gov-input transition-all
                    ${shakeAll ? "shake" : ""}
                    ${posIdx === upsideDownIdx ? "upside-down" : ""}
                    ${otp[originalIdx] ? "bg-green-100 border-green-600" : ""}
                  `}
                  placeholder="?"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hidden hint */}
        <p className="text-[9px] text-center text-gray-400 italic mb-4">
          Hint: try 1-2-3-4-5-6 (in the right boxes, in the right order, when they stop moving)
        </p>

        {/* Shuffled numpad */}
        <div className="mb-4">
          <p className="text-[10px] text-center text-gray-500 mb-2 uppercase font-bold">
            Alternatively, use our SECURE NUMPAD™ (also shuffled):
          </p>
          <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto">
            {numpadOrder.map((digit, i) => (
              <motion.button
                key={i}
                layout
                onClick={() => handleNumpadPress(digit)}
                className="gov-btn-secondary text-lg font-black py-2"
                whileTap={{ scale: 0.85 }}
              >
                {digit}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Resend — barely visible */}
        <div className="text-center mb-4 relative h-5">
          <AnimatePresence>
            {resendVisible && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="text-[9px] text-blue-700 underline absolute inset-0"
                onClick={() => setResendMsg("OTP resent to your grandfather's fax machine.")}
              >
                RESEND OTP
              </motion.button>
            )}
          </AnimatePresence>
          {!resendVisible && (
            <span className="text-[9px] text-gray-300 select-none">Resend OTP available for 0.3 seconds every 8 seconds. Watch carefully.</span>
          )}
        </div>
        {resendMsg && <p className="text-[9px] text-green-700 text-center mb-2 font-bold">{resendMsg}</p>}

        {/* CRT log */}
        <div className="crt-screen text-[9px] mb-4 space-y-0.5">
          <p>&gt; OTP_GATEWAY: ATTEMPTING CONNECTION...</p>
          <p>&gt; PACKET_LOSS: 98%</p>
          <p>&gt; RETRYING... ({attempts} failed attempt{attempts !== 1 ? "s" : ""})</p>
          <p>&gt; CITIZEN_PATIENCE: {timer > 60 ? "CRITICAL" : "MODERATE"}</p>
          <p className="blink-fast">&gt; _</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={handleClear} className="gov-btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
            <RefreshCw size={14} /> CLEAR
          </button>
          <button onClick={handleSubmit} className="gov-btn flex-1 text-sm">
            VERIFY & SUFFER MORE
          </button>
        </div>

        {/* Attempts counter */}
        {attempts > 0 && (
          <p className={`text-center text-[10px] mt-3 font-bold ${attempts > 3 ? "text-red-600 blink" : "text-gray-500"}`}>
            {attempts} attempt{attempts > 1 ? "s" : ""}. Each attempt is logged and judged.
          </p>
        )}

        {/* Static banner ad at the bottom of card */}
        <div className="mt-4 border-t-2 border-[#1f2937] pt-4">
          <UnhingedAd type="banner" />
        </div>
      </div>

      <ChatBot />
    </div>
  );
}
