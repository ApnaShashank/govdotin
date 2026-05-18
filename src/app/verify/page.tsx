"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "@/components/ChatBot";
import FakeLoader from "@/components/FakeLoader";
import SessionTimer from "@/components/SessionTimer";
import UnhingedAd from "@/components/UnhingedAd";

type Step = "intro" | "webcam" | "fingerprint" | "retina" | "done";

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [showLoader, setShowLoader] = useState(false);

  // Webcam step state
  const [faceBoxPos, setFaceBoxPos] = useState({ x: 80, y: 60 });
  const [webcamAttempts, setWebcamAttempts] = useState(0);
  const [webcamMsg, setWebcamMsg] = useState("Please align your face with the green box.");

  // Fingerprint step state
  const [scanPhase, setScanPhase] = useState<"idle" | "scanning" | "fail" | "retry">("idle");
  const [fingerPresses, setFingerPresses] = useState(0);

  // Retina step state
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [gazeAttempts, setGazeAttempts] = useState(0);
  const [blinkCount, setBlinkCount] = useState(0);

  // Move face box randomly every 1.5s during webcam step
  useEffect(() => {
    if (step !== "webcam") return;
    const t = setInterval(() => {
      setFaceBoxPos({
        x: 20 + Math.random() * 55,
        y: 15 + Math.random() * 50,
      });
      setWebcamAttempts(a => a + 1);
      const msgs = [
        "Face not detected. Please be more face-like.",
        "Too many faces detected (you only have one — we hope).",
        "Lighting too bright. Please dim the sun.",
        "Please remove your face and reattach properly.",
        "Background too complex. Sit in front of a plain white wall. In Dilli.",
        "Eyes not open enough. Or too open. Can't tell.",
        "Smile at the camera. This will not help.",
      ];
      setWebcamMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 1800);
    return () => clearInterval(t);
  }, [step]);

  // Fingerprint scan
  const startScan = () => {
    setScanPhase("scanning");
    setFingerPresses(p => p + 1);
    setTimeout(() => {
      setScanPhase("fail");
      setTimeout(() => setScanPhase("retry"), 1200);
    }, 2200);
  };

  // Retina dot moves every 1s
  useEffect(() => {
    if (step !== "retina") return;
    const t = setInterval(() => {
      setDotPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 });
    }, 900);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col relative">

      {/* Floating Unhinged Ads */}
      <UnhingedAd type="floating" />

      {showLoader && (
        <FakeLoader
          durationMs={6000}
          messages={[
            "Uploading biometric data to national server...",
            "Cross-checking with 1947 census photographs...",
            "Verifying you are not a robot (or a buffalo)...",
            "Checking if your face is on any watchlists...",
            "It is. Just kidding. Probably.",
            "Biometric hash mismatch... retrying...",
            "Almost verified... server crashed... retrying...",
            "Successfully failed. Trying again differently.",
          ]}
          onComplete={() => {
            setShowLoader(false);
            setStep("done");
          }}
        />
      )}

      {/* Header */}
      <header className="bg-[#1a237e] border-b-4 border-yellow-400 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider">👁️ AADHAAR BIOMETRIC VERIFICATION</h1>
          <p className="text-[10px] text-blue-300">Powered by National Biometric Suffering Infrastructure (NBSI) v1.2</p>
        </div>
        <SessionTimer />
      </header>

      {/* Step progress */}
      <div className="bg-[#161b22] border-b border-gray-700 px-6 py-3 flex gap-2 items-center">
        {(["intro", "webcam", "fingerprint", "retina", "done"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-black
              ${step === s ? "bg-yellow-400 border-yellow-400 text-black" :
                ["intro","webcam","fingerprint","retina","done"].indexOf(step) > i
                  ? "bg-green-600 border-green-400 text-white"
                  : "bg-gray-700 border-gray-600 text-gray-400"}`}>
              {["intro","webcam","fingerprint","retina","done"].indexOf(step) > i ? "✓" : i + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase hidden sm:inline
              ${step === s ? "text-yellow-400" : "text-gray-500"}`}>
              {s}
            </span>
            {i < 4 && <div className="w-6 h-0.5 bg-gray-600" />}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="gov-card max-w-lg w-full text-black text-center"
            >
              <div className="text-6xl mb-4 float">🪪</div>
              <h2 className="text-2xl font-black text-blue-900 mb-2">BIOMETRIC VERIFICATION REQUIRED</h2>
              <p className="text-sm text-gray-600 mb-4">
                To confirm your identity, you will be required to complete <strong>3 biometric steps</strong>:
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                {[
                  { icon: "📷", label: "Webcam Selfie", desc: "Face alignment challenge" },
                  { icon: "🖐️", label: "Fingerprint", desc: "Scanner always fails" },
                  { icon: "👁️", label: "Retina Scan", desc: "Follow the moving dot" },
                ].map((item, i) => (
                  <div key={i} className="border-2 border-blue-900 p-3 bg-blue-50">
                    <div className="text-3xl mb-1">{item.icon}</div>
                    <p className="font-black text-blue-900">{item.label}</p>
                    <p className="text-gray-500 text-[9px]">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border-l-4 border-red-600 p-3 text-xs text-left mb-4">
                <p className="font-black text-red-700 mb-1">⚠️ MANDATORY NOTICE:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• All biometric data will be stored permanently and shared with relevant (irrelevant) departments</li>
                  <li>• Blinking during retina scan will restart the process</li>
                  <li>• Fingerprint scanner only works on Tuesdays</li>
                  <li>• By proceeding, you consent to your soul being digitised</li>
                </ul>
              </div>
              <button className="gov-btn w-full text-lg" onClick={() => setStep("webcam")}>
                I CONSENT (I HAD NO CHOICE) →
              </button>
            </motion.div>
          )}

          {/* ── WEBCAM ── */}
          {step === "webcam" && (
            <motion.div
              key="webcam"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="gov-card max-w-lg w-full text-black"
            >
              <h2 className="text-xl font-black text-blue-900 mb-1">📷 STEP 1: WEBCAM SELFIE</h2>
              <p className="text-xs text-gray-500 mb-3">Align your face with the green box. The box will assist you.</p>

              {/* Fake webcam view */}
              <div className="relative bg-gray-900 rounded border-4 border-gray-600 overflow-hidden mb-3" style={{ height: 280 }}>
                {/* Scanlines overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none scanlines" />

                {/* CRT noise */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs italic">
                  [Camera feed unavailable — this is fine]
                </div>

                {/* Moving face guide box */}
                <motion.div
                  animate={{ x: `${faceBoxPos.x}%`, y: `${faceBoxPos.y}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="absolute z-20 border-4 border-green-400"
                  style={{ width: 90, height: 110, transform: "translate(-50%, -50%)" }}
                >
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-green-400" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-green-400" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-green-400" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-green-400" />
                </motion.div>

                {/* Status overlay */}
                <div className="absolute bottom-2 left-2 right-2 z-20 bg-black/70 p-1 text-green-400 font-mono text-[9px]">
                  {webcamMsg}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-400 p-2 text-xs mb-4">
                <span className="font-bold">Attempts:</span> {webcamAttempts} &nbsp;|&nbsp;
                <span className="font-bold">Success rate:</span> 0%
              </div>

              {webcamAttempts >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3">
                  <button
                    className="gov-btn w-full"
                    onClick={() => setStep("fingerprint")}
                  >
                    GIVE UP ON WEBCAM → PROCEED TO FINGERPRINT
                  </button>
                  <p className="text-[9px] text-gray-400 text-center mt-1">
                    (Face verification will be marked as "suspicious" in your file)
                  </p>
                </motion.div>
              )}

              {webcamAttempts < 4 && (
                <p className="text-[10px] text-center text-gray-400 italic">
                  Please hold still. The box will find you eventually.
                </p>
              )}
            </motion.div>
          )}

          {/* ── FINGERPRINT ── */}
          {step === "fingerprint" && (
            <motion.div
              key="fingerprint"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="gov-card max-w-lg w-full text-black text-center"
            >
              <h2 className="text-xl font-black text-blue-900 mb-1">🖐️ STEP 2: FINGERPRINT SCAN</h2>
              <p className="text-xs text-gray-500 mb-4">
                Place your right thumb on the scanner below.<br />
                <span className="text-red-600 font-bold">Note: Scanner only works on Tuesdays.</span>
              </p>

              {/* Fingerprint pad */}
              <div
                className={`mx-auto w-40 h-40 rounded-full border-8 cursor-pointer flex items-center justify-center text-6xl select-none transition-all
                  ${scanPhase === "idle"    ? "border-gray-400 bg-gray-100 hover:border-blue-500 hover:bg-blue-50" : ""}
                  ${scanPhase === "scanning" ? "border-blue-500 bg-blue-100 animate-pulse" : ""}
                  ${scanPhase === "fail"    ? "border-red-600 bg-red-100 shake" : ""}
                  ${scanPhase === "retry"   ? "border-orange-400 bg-orange-50" : ""}
                `}
                onClick={startScan}
              >
                {scanPhase === "idle"     && "🖐️"}
                {scanPhase === "scanning" && <div className="text-blue-600 font-black text-sm animate-spin">⟳ SCANNING</div>}
                {scanPhase === "fail"     && "❌"}
                {scanPhase === "retry"    && "🖐️"}
              </div>

              <div className="mt-4 min-h-[2rem] text-sm font-bold">
                {scanPhase === "idle"     && <p className="text-gray-500">Press the pad to scan</p>}
                {scanPhase === "scanning" && <p className="text-blue-600 blink">Scanning... please do not breathe.</p>}
                {scanPhase === "fail"     && <p className="text-red-600">SCAN FAILED: Fingerprint too fingerprint-y.</p>}
                {scanPhase === "retry"    && <p className="text-orange-600">Try again. And again. And again.</p>}
              </div>

              {fingerPresses > 0 && (
                <div className="mt-3 crt-screen text-xs text-left space-y-0.5 max-w-xs mx-auto">
                  <p>&gt; SCANNER_STATUS: CONFUSED</p>
                  <p suppressHydrationWarning>&gt; MATCH_SCORE: {Math.floor(Math.random() * 20)}% (need 100%)</p>
                  <p>&gt; ATTEMPTS: {fingerPresses}</p>
                  {fingerPresses >= 3 && <p className="text-yellow-400">&gt; HINT: It never works. Click below.</p>}
                </div>
              )}

              {fingerPresses >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                  <button className="gov-btn w-full" onClick={() => setStep("retina")}>
                    SKIP FINGERPRINT (mark as suspicious) →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── RETINA ── */}
          {step === "retina" && (
            <motion.div
              key="retina"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gov-card max-w-lg w-full text-black text-center"
            >
              <h2 className="text-xl font-black text-blue-900 mb-1">👁️ STEP 3: RETINA TRACKING</h2>
              <p className="text-xs text-gray-500 mb-1">Follow the red dot with your eyes. Do NOT blink.</p>
              <p className="text-[9px] text-red-600 font-bold mb-4 blink">Blinking = automatic failure. We are watching.</p>

              {/* Retina tracking area */}
              <div
                className="relative bg-black border-4 border-blue-900 mx-auto overflow-hidden"
                style={{ width: 320, height: 220 }}
                onClick={() => { setGazeAttempts(a => a + 1); }}
              >
                <motion.div
                  animate={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-red-300"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="border border-blue-900/30" />
                  ))}
                </div>
                <div className="absolute bottom-1 left-1 right-1 text-green-400 font-mono text-[8px]">
                  GAZE_TRACKING: {gazeAttempts > 0 ? "UNSTABLE" : "INITIALIZING"}
                  &nbsp;| BLINKS_DETECTED: {blinkCount}
                </div>
              </div>

              <div className="mt-3 flex gap-3 justify-center">
                <button
                  className="gov-btn-secondary text-xs py-1 px-3"
                  onClick={() => { setBlinkCount(b => b + 1); alert("BLINK DETECTED! Resetting retina scan. Please stop having eyelids."); }}
                >
                  I BLINKED (confession)
                </button>
                {gazeAttempts >= 5 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="gov-btn text-xs py-1 px-3"
                    onClick={() => { setShowLoader(true); }}
                  >
                    SUBMIT & VERIFY →
                  </motion.button>
                )}
              </div>

              {gazeAttempts < 5 && (
                <p className="text-[9px] text-gray-400 mt-3">
                  Click inside the tracking area {5 - gazeAttempts} more times to unlock submission.
                </p>
              )}

              {blinkCount > 0 && (
                <p className="text-[9px] text-red-500 mt-1 font-bold">
                  {blinkCount} blink{blinkCount > 1 ? "s" : ""} detected. This will be noted in your permanent record.
                </p>
              )}
            </motion.div>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="gov-card max-w-lg w-full text-black text-center"
            >
              <div className="text-7xl mb-4 float">🎉</div>
              <h2 className="text-3xl font-black text-green-700 mb-2">VERIFICATION COMPLETE!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Congratulations! Your biometric data has been successfully lost in our servers.
              </p>

              <div className="bg-gray-50 border-2 border-dashed border-gray-400 p-4 text-xs text-left mb-4 space-y-1">
                <p><span className="font-bold">Webcam:</span> <span className="text-red-600">SUSPICIOUS</span></p>
                <p><span className="font-bold">Fingerprint:</span> <span className="text-red-600">SKIPPED (noted)</span></p>
                <p><span className="font-bold">Retina:</span> <span className="text-orange-600">PARTIAL ({blinkCount} blink{blinkCount !== 1 ? "s" : ""} flagged)</span></p>
                <p><span className="font-bold">Overall Status:</span> <span className="text-orange-600 font-black">CONDITIONALLY MAYBE VERIFIED</span></p>
                <p className="text-[9px] text-gray-400 mt-1">Your file has been sent to 47 departments for review. ETA: 14 years.</p>
              </div>

              <div className="flex gap-3">
                <button className="gov-btn flex-1" onClick={() => router.push("/apply/income-certificate")}>
                  CONTINUE APPLYING →
                </button>
                <button className="gov-btn-secondary flex-1" onClick={() => router.push("/dashboard")}>
                  BACK TO DASHBOARD
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <ChatBot />

      <footer className="bg-[#1a237e] text-[8px] text-center text-blue-300 py-2 border-t-2 border-yellow-400">
        AADHAAR BIOMETRIC SYSTEM | DATA STORED FOREVER | © MINISTRY OF BIOMETRIC SUFFERING
      </footer>
    </div>
  );
}
