"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldAlert, FileImage, PenTool, CheckCircle, RefreshCw } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import SessionTimer from "@/components/SessionTimer";
import UnhingedAd from "@/components/UnhingedAd";
import FakeLoader from "@/components/FakeLoader";

type Step = "bribe" | "destination" | "photo" | "signature" | "done";

export default function PassportPage() {
  const router = useRouter();
  
  // State
  const [step, setStep] = useState<Step>("bribe");
  const [rage, setRage] = useState(25);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessages, setLoaderMessages] = useState<string[]>([]);
  
  // Step 1: Bribery Convenience Slider
  const [bribe, setBribe] = useState(0);
  const [timeEstimate, setTimeEstimate] = useState("142 years");
  const [acbRaid, setAcbRaid] = useState(false);
  const [acbFinePaid, setAcbFinePaid] = useState(false);

  // Step 2: Escape Location Blocker
  const [destination, setDestination] = useState("");
  const [emigrationWarning, setEmigrationWarning] = useState("");
  const [patriotismScore, setPatriotismScore] = useState(100);

  // Step 3: Photo Scanner
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [scanPhase, setScanPhase] = useState<"idle" | "scanning" | "failed" | "success">("idle");
  const [photoAttempts, setPhotoAttempts] = useState(0);

  // Step 4: Latency Signature Pad
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureAttempts, setSignatureAttempts] = useState(0);
  const [mousePoints, setMousePoints] = useState<{ x: number; y: number }[]>([]);

  const addRage = (amt = 8) => setRage(r => Math.min(100, r + amt));

  // Step 1: Bribery slider reaction
  useEffect(() => {
    if (bribe === 0) {
      setTimeEstimate("142 years, 8 months (subject to police inspector's retirement)");
    } else if (bribe < 1000) {
      setTimeEstimate("35 years, 4 months");
    } else if (bribe < 3000) {
      setTimeEstimate("8 years, 11 months");
    } else if (bribe < 5000) {
      setTimeEstimate("3 days (pending central bribe verification)");
    } else {
      // Bribe > 5000: ACB RAID!
      setAcbRaid(true);
      addRage(25);
    }
  }, [bribe]);

  // Step 2: Emigration warnings
  useEffect(() => {
    if (!destination) return;
    addRage(4);
    const antiEmigrationDestinations = ["Canada", "United Kingdom", "United States", "Australia", "Germany"];
    
    if (antiEmigrationDestinations.includes(destination)) {
      setPatriotismScore(12);
      setEmigrationWarning(`🚨 SUSPECTED CAPITAL & CITIZEN FLIGHT! Attempting to escape the national suffering pool to ${destination} is categorized as highly unpatriotic under Anti-Emigration Decree 2024. Your physical properties have been earmarked for central audit.`);
    } else if (destination === "North Korea") {
      setPatriotismScore(100);
      setEmigrationWarning("✅ PATRIOTIC DESTINATION APPROVED. Direct flight under bilateral misery sharing program.");
    } else if (destination === "Vatican City") {
      setPatriotismScore(95);
      setEmigrationWarning("✅ SPIRITUAL RETREAT DETECTED. Approved pending holy water verification.");
    } else {
      setPatriotismScore(45);
      setEmigrationWarning(`⚠️ MODERATE SUSPICION: Travel to ${destination} approved but subject to 400% foreign exchange transaction surcharge.`);
    }
  }, [destination]);

  // Step 4 Latency Signature pad logic
  // Draw signature points on canvas
  useEffect(() => {
    if (step !== "signature") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    mousePoints.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
  }, [mousePoints, step]);

  const startSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setMousePoints([{ x, y }]);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simulate high latency (1.5-second lag before rendering lines)
    setTimeout(() => {
      setMousePoints(prev => [...prev, { x, y }]);
    }, 800);
  };

  const stopSignature = () => {
    setIsDrawing(false);
  };

  const verifySignature = () => {
    setSignatureAttempts(a => a + 1);
    addRage(10);
    const score = Math.floor(Math.random() * 5) + 2; // 2-6% match
    alert(`Signature Verification failed. Match score: ${score}% (need 99%). Your signature looks like a nested spaghetti loop. Please sign exactly like your primary school attendance ledger.`);
    setMousePoints([]);
  };

  // Step 3 photo scanner logic
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoError("");
    setScanPhase("scanning");
    setPhotoAttempts(a => a + 1);
    addRage(8);

    setTimeout(() => {
      const scans = [
        "REJECTED: Subject's left ear is asymmetrical by 0.3mm compared to right ear. Face symmetry failure.",
        "REJECTED: Subject is smiling. Smiling is prohibited in formal state travel documents. Passport photo requires standard bureaucratic depression.",
        "REJECTED: Subject looks too optimistic. State travels are highly stressful; your photo must look exhausted."
      ];
      
      setScanPhase("failed");
      setPhotoError(scans[Math.floor(Math.random() * scans.length)]);
    }, 3000);
  };

  const handleAcbFinePay = () => {
    addRage(15);
    setAcbFinePaid(true);
    alert("Fine processed! Anti-Corruption Bureau has temporarily suspended your raid. Convenience fee has been reset to ₹0.");
    setBribe(0);
    setAcbRaid(false);
    setAcbFinePaid(false);
  };

  const submitPassport = () => {
    setShowLoader(true);
    setLoaderMessages([
      "Submitting passport file to Central Police Inspector...",
      "Filing emigration intent to national treasury...",
      "Analyzing facial symmetry again (still asymmetrical)...",
      "Drafting tax surcharge on escape funds...",
      "Applying bribe convenience overrides...",
      "Encrypting signature (looks like pasta, but okay)...",
      "Passport renewal successfully deleted! Backing up to fax..."
    ]);
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] text-[#004d40] flex flex-col font-mono relative">

      {/* Fake loader */}
      {showLoader && (
        <FakeLoader
          durationMs={7000}
          messages={loaderMessages}
          onComplete={() => {
            setShowLoader(false);
            setStep("done");
          }}
        />
      )}

      {/* Floating Ads */}
      <UnhingedAd type="floating" onAction={addRage} />

      {/* ACB Raid Block Modal */}
      <AnimatePresence>
        {acbRaid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[10005] bg-black/95 flex items-center justify-center p-4"
          >
            <div className="gov-card max-w-md w-full border-4 border-red-700 bg-white p-6 shadow-[20px_20px_0_red] text-center">
              <ShieldAlert size={64} className="text-red-600 mx-auto shake mb-2 animate-bounce" />
              <h2 className="text-2xl font-black text-red-700 uppercase tracking-widest mb-2">🚨 ACB RAID IN PROGRESS 🚨</h2>
              <p className="text-sm font-bold text-gray-800 leading-relaxed mb-4">
                Anti-Corruption Bureau (ACB) has locked your portal account! Convenience fee setting of <strong className="text-red-600">₹{bribe}</strong> was flagged as a public bribery attempt.
              </p>
              <div className="bg-red-50 p-3 border-2 border-red-400 text-xs text-left mb-4 space-y-1">
                <p className="text-red-700 font-black uppercase">INCIDENT DETAILS:</p>
                <p>• <strong>Accused:</strong> Citizen #9421-B</p>
                <p>• <strong>Bribe amount:</strong> ₹{bribe}</p>
                <p>• <strong>Crime:</strong> Attempted passport speed bribe</p>
                <p>• <strong>Penalty Fine:</strong> ₹10,000 Amnesty Fine</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={handleAcbFinePay} className="gov-btn w-full bg-red-700 text-xs py-3 font-black uppercase">
                  Pay Raid Amnesty Fine (₹10,000) 💸
                </button>
                <button
                  onClick={() => {
                    addRage(20);
                    router.push("/dashboard");
                  }}
                  className="gov-btn-secondary w-full text-xs py-2 uppercase"
                >
                  Give Up and Flee to Village
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#00695c] text-[#e0f2f1] p-4 border-b-4 border-[#004d40] flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest">🛂 PASSPORT SPEED RENEWAL</h1>
          <p className="text-[10px] text-teal-200">National Consular & Misery Extraction System | PASSPORT-ACT 2025</p>
        </div>
        <div className="flex items-center gap-4">
          <SessionTimer />
          <button onClick={() => router.push("/dashboard")} className="gov-btn-secondary py-1 text-xs text-yellow-400">
            ← DASHBOARD
          </button>
        </div>
      </header>

      {/* Step progress timeline */}
      <div className="bg-[#b2dfdb] px-6 py-2 border-b border-[#004d40] flex gap-2 overflow-x-auto text-[10px] font-black">
        {[
          { key: "bribe", label: "1. Convenience Fee" },
          { key: "destination", label: "2. Travel Escape Destination" },
          { key: "photo", label: "3. Asymmetric Photo Scan" },
          { key: "signature", label: "4. Laggy Signature Pad" },
          { key: "done", label: "5. Processing Loss" }
        ].map((s, idx) => (
          <div key={s.key} className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-0.5 border ${step === s.key ? "bg-[#004d40] text-white" : "bg-[#e0f2f1]"}`}>
              {s.label}
            </span>
            {idx < 4 && <span className="opacity-50">→</span>}
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 grid grid-cols-4 gap-6">

        {/* Left Side Info Panel / Sidebar Ad */}
        <div className="col-span-1 space-y-4">
          <div className="bg-[#b2dfdb] p-3 border-2 border-dashed border-[#004d40] text-[9px] leading-relaxed">
            <h3 className="font-black text-[11px] mb-1 uppercase text-red-700">📢 EMIGRATION BAN WARNINGS</h3>
            <p className="mb-2">• Anti-Emigration Decree 2024 prohibits traveling abroad with intentions of staying happy.</p>
            <p className="mb-2">• Traveling to high-income nations incurs a 45% patriotism surcharge on your assets.</p>
            <p>• Passports issued will be printed on single-ply sandpaper to discourage international travel.</p>
          </div>
          <UnhingedAd type="sidebar" onAction={addRage} />
          <div className="bg-black text-[#00ff41] p-3 rounded border-4 border-gray-600 font-mono text-[9px]">
            <div>&gt; PORTAL_TRAUMA_INDEX: {rage}%</div>
            <div>&gt; POLICE_STATUS: HOSTILE</div>
            <div>&gt; BRIBE_LEVEL: ₹{bribe}</div>
          </div>
        </div>

        {/* Center Application Form Area */}
        <div className="col-span-2">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: BRIBERY SLIDER ── */}
            {step === "bribe" && (
              <motion.div
                key="bribe"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="gov-card bg-white border-4 border-black p-6"
              >
                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-1">🛂 CONVENIENCE PROCESSING FEE</h2>
                <p className="text-xs text-gray-500 mb-2">Adjust the convenience processing fee slider in Rupees. More convenience = faster passport.</p>
                
                {/* Bribe speed banner */}
                <div className="mb-4 border-2 border-black">
                  <Image src="/assets/ad_bribe.png" alt="Bribe Ad" width={400} height={120} className="w-full h-auto object-cover" />
                </div>

                {/* Convenience slider */}
                <div className="bg-gray-100 p-4 border-2 border-black mb-6">
                  <label className="block text-xs font-black mb-1">CONVENIENCE FEE (₹):</label>
                  <input
                    type="range"
                    min={0}
                    max={6000}
                    step={100}
                    value={bribe}
                    onChange={e => { setBribe(Number(e.target.value)); addRage(1); }}
                    className="w-full h-3 bg-teal-200 border-2 border-black rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-gray-500">₹0 (Standard)</span>
                    <span className="text-lg font-black text-[#004d40] underline">
                      ₹{bribe.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-gray-500">₹6,000 (VIP Bribe)</span>
                  </div>
                  <div className="mt-4 bg-[#b2dfdb] p-3 border border-[#004d40] text-center text-xs">
                    <p className="font-black text-[11px]">ESTIMATED PROCESSING TIME:</p>
                    <p className="text-red-700 font-black text-lg blink mt-1">{timeEstimate}</p>
                  </div>
                  <p className="text-[8px] text-red-600 font-bold mt-2 text-center">
                    ⚠️ WARNING: Convenience fees above ₹5,000 may trigger Anti-Corruption alarms.
                  </p>
                </div>

                <button
                  onClick={() => { addRage(4); setStep("destination"); }}
                  className="gov-btn w-full flex items-center justify-center gap-2"
                >
                  CONFIRM CONVENIENCE FEE <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: ESCAPE LOCATION BLOCKER ── */}
            {step === "destination" && (
              <motion.div
                key="destination"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="gov-card bg-white border-4 border-black p-6"
              >
                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-1">🛂 CHOOSE FLIGHT ESCAPE DESTINATION</h2>
                <p className="text-xs text-gray-500 mb-4">Under Anti-Emigration policies, we restrict passport issuance to suspicious flight destinations.</p>

                {/* Country dropdown selection */}
                <div className="bg-gray-100 p-4 border-2 border-black mb-4">
                  <label className="block text-xs font-black mb-1">PROPOSED DESTINATION COUNTRY:</label>
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="gov-input text-sm font-black bg-white cursor-pointer"
                  >
                    <option value="">-- Choose Escape Destination --</option>
                    <option value="Canada">Canada (Capital Emigration Trap)</option>
                    <option value="United Kingdom">United Kingdom (Citizen Drain)</option>
                    <option value="United States">United States (Wealth Drain)</option>
                    <option value="Australia">Australia (Extreme Suspicion)</option>
                    <option value="North Korea">North Korea (Bilateral Happiness Agreement)</option>
                    <option value="Vatican City">Vatican City (Holy Retreat)</option>
                    <option value="Somalia">Somalia (Safe Havens)</option>
                  </select>

                  {destination && (
                    <div className="mt-4 bg-teal-50 border-l-4 border-teal-700 p-3 text-xs leading-relaxed text-teal-900">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-[10px]">PATRIOTISM RATING:</span>
                        <span className={`font-black text-xs ${patriotismScore < 30 ? "text-red-700 blink" : "text-green-700"}`}>
                          {patriotismScore}/100
                        </span>
                      </div>
                      <p className="font-bold text-gray-700">{emigrationWarning}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <button onClick={() => setStep("bribe")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                  <button
                    onClick={() => {
                      if (!destination) {
                        alert("Select escape destination first!");
                        return;
                      }
                      if (patriotismScore < 20) {
                        alert("Access Denied! Under capital flight audit, you cannot proceed to photo verification for emigrating to high-income nations. Please select Vatican City or North Korea.");
                        addRage(15);
                      } else {
                        setStep("photo");
                      }
                    }}
                    className="gov-btn text-xs py-2 px-6"
                  >
                    NEXT: PHOTO SCAN →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: PHOTO ASYMMETRY SCANNER ── */}
            {step === "photo" && (
              <motion.div
                key="photo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-xl font-black text-blue-900 mb-1 flex items-center justify-center gap-1">
                  📸 STEP 3: FACIAL DEPENSITY SCAN
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                  Upload your recent passport size photo. Face symmetry and sadness quotient strictly verified by AI scanner.
                </p>

                {/* Upload box */}
                <div className="border-4 border-dashed border-[#004d40] bg-teal-50 p-6 flex flex-col items-center justify-center relative cursor-pointer hover:bg-teal-100 transition-colors">
                  <input
                    type="file"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileImage size={44} className="text-[#00695c] mb-2 animate-pulse" />
                  <p className="text-xs font-black">DRAG PASSPORT PHOTO HERE</p>
                  <p className="text-[9px] text-gray-500 mt-1">Acceptable formats: .png, .jpg, .heic (max size: 12KB)</p>
                </div>

                {scanPhase === "scanning" && (
                  <div className="mt-4 text-xs font-bold text-blue-700 blink">
                    <RefreshCw className="animate-spin inline mr-1" size={12} />
                    Scanning facial ears symmetry and sadness quotient... Keep eyes plain.
                  </div>
                )}

                {scanPhase === "failed" && (
                  <div className="mt-4 bg-red-50 border-2 border-red-700 p-3 text-left text-[10px] text-red-800 font-bold">
                    <p className="mb-2 text-red-700 font-black uppercase">SCANNER ALERT [Code E-09]:</p>
                    <p className="mb-2">{photoError}</p>
                    <button
                      onClick={() => {
                        addRage(12);
                        alert("Cow photo override applied. Match verification: 99.8% (Cattle standard). Proceeding to signature.");
                        setStep("signature");
                      }}
                      className="w-full bg-[#004d40] text-[#e0f2f1] py-1 border border-black text-[9px] font-black uppercase"
                    >
                      Bypass: Upload Cow Photo instead (Fast-Track) 🐮
                    </button>
                  </div>
                )}

                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setStep("destination")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: LAGGY SIGNATURE PAD ── */}
            {step === "signature" && (
              <motion.div
                key="signature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-xl font-black text-blue-900 mb-1 flex items-center justify-center gap-1">
                  <PenTool className="text-teal-800" size={24} /> STEP 4: MANDATORY SIGNATURE PAD
                </h2>
                <p className="text-xs text-gray-600 mb-2">
                  Sign your official signature in the canvas below.<br />
                  <span className="text-red-700 font-black blink">Simulated 1.5-second console buffer latency active.</span>
                </p>

                {/* Drawing board */}
                <div className="mx-auto border-4 border-black rounded bg-gray-50 relative overflow-hidden" style={{ width: 340, height: 200 }}>
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={200}
                    onMouseDown={startSignature}
                    onMouseMove={drawSignature}
                    onMouseUp={stopSignature}
                    onMouseLeave={stopSignature}
                    className="cursor-crosshair absolute top-0 left-0 z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] text-teal-900/30 font-bold select-none">
                    SIGN HERE (Cursor has simulated input lag)
                  </div>
                </div>

                <div className="mt-3 flex gap-2 justify-center text-xs">
                  <button
                    onClick={() => {
                      setMousePoints([]);
                      addRage(4);
                    }}
                    className="gov-btn-secondary py-1 text-[10px]"
                  >
                    Clear Canvas
                  </button>
                  <button
                    onClick={verifySignature}
                    className="gov-btn py-1 text-[10px]"
                  >
                    Scan Signature
                  </button>
                </div>

                {signatureAttempts > 0 && (
                  <div className="mt-4 bg-gray-100 p-3 border-2 border-black text-left text-[10px] space-y-1">
                    <p>&gt; TOTAL_VERIFY_ATTEMPTS: {signatureAttempts}</p>
                    <p>&gt; LAST_MATCH_STATUS: 1.4% MATCH</p>
                    {signatureAttempts >= 3 && (
                      <p className="text-yellow-600 font-bold blink">
                        💡 HINT: Click below to apply cow hoofprint signature bypass.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-3 justify-center">
                  <button onClick={() => setStep("photo")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                  {signatureAttempts >= 3 && (
                    <button
                      onClick={() => {
                        addRage(12);
                        alert("Cow hoofprint signature override successfully accepted. Passport marked as cattle grade.");
                        submitPassport();
                      }}
                      className="gov-btn text-xs py-2 px-4 bg-yellow-600 border-yellow-400"
                    >
                      Bypass: Submit Cow Hoofprint →
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: DONE ── */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <div className="text-7xl mb-4 float">🛂</div>
                <h2 className="text-2xl font-black text-green-700 mb-2 uppercase">PASSPORT APPLICATION STALLED!</h2>
                <p className="text-xs text-gray-600 mb-4 font-bold">
                  Your speed passport application has been compiled and is currently being misplaced inside our archives.
                </p>

                <div className="bg-[#b2dfdb] p-4 text-left border-2 border-black text-xs space-y-1 relative overflow-hidden mb-6">
                  {/* Watermark */}
                  <div className="absolute right-[-20px] bottom-[-25px] opacity-10 font-mono text-8xl font-black uppercase select-none -rotate-12">
                    STALLED
                  </div>
                  <p><span className="font-black">Application No:</span> <span className="font-bold">PP-2025-CATTLE-OVERRIDE</span></p>
                  <p><span className="font-black">Escape Target:</span> <span className="font-bold">{destination}</span></p>
                  <p><span className="font-black">Convenience Fee Paid:</span> <span className="text-red-700 font-black">₹{bribe}</span></p>
                  <p><span className="font-black">Photo Status:</span> <span className="text-red-600 font-bold">COW PHOTO SUBMITTED</span></p>
                  <p><span className="font-black">Police Clearance Status:</span> <span className="text-red-700 font-black">EXTREMELY HOSTILE</span></p>
                  <p className="text-[9px] text-gray-500 font-bold mt-2 italic">
                    Note: Your passport has been issued under Category-C (Livestock category). Please board the cattle freight plane for travel to {destination}.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="gov-btn flex-1 text-xs" onClick={() => router.push("/queue")}>
                    GO BACK TO QUEUE (WAIT) →
                  </button>
                  <button className="gov-btn-secondary flex-1 text-xs" onClick={() => router.push("/dashboard")}>
                    DASHBOARD
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Column Ads / Entertainment */}
        <div className="col-span-1 space-y-4">
          <UnhingedAd type="sidebar" onAction={addRage} />
          
          <div className="bg-[#00695c] text-[#e0f2f1] p-4 border-4 border-[#004d40] text-center shadow-lg">
            <h3 className="font-black text-xs mb-1 uppercase">🛂 ESCAPE CONSULTANT</h3>
            <p className="text-[9px] leading-tight mb-2">Want to bypass Anti-Emigration locks for Canada? Send passport fee directly to our chatbot SEVA-BOT. (Chatbot will steal your money).</p>
            <button
              onClick={() => alert("Central Consul officer has gone on tea break. Expected return: 2029.")}
              className="w-full bg-[#e0f2f1] text-[#004d40] py-1 border border-black text-[9px] font-black uppercase active:translate-y-0.5"
            >
              ✍️ Summon Consul Officer
            </button>
          </div>
        </div>

      </div>

      {/* Chatbot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-[#00695c] text-[8px] text-center text-teal-200 py-2 border-t-4 border-[#004d40]">
        © 1947–2026 CENTRAL CONSULAR ESCAPE PORTAL | DATA EXCHANGED WITH CATTLE COMMISSION | STRESS: CRITICAL
      </footer>

    </div>
  );
}
