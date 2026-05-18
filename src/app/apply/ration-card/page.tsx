"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Dna, FileUp, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import SessionTimer from "@/components/SessionTimer";
import UnhingedAd from "@/components/UnhingedAd";
import FakeLoader from "@/components/FakeLoader";

type Step = "quota" | "captcha" | "dna" | "spit" | "confirm" | "done";

export default function RationCardPage() {
  const router = useRouter();
  
  // Page states
  const [step, setStep] = useState<Step>("quota");
  const [rage, setRage] = useState(20);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessages, setLoaderMessages] = useState<string[]>([]);
  
  // Step 1: Quota
  const [micrograms, setMicrograms] = useState(500000); // 500,000 mcg = 0.5g
  const [income, setIncome] = useState(12000);
  const [incomeFeedback, setIncomeFeedback] = useState("");
  
  // Step 2: Pebble Captcha
  const [captchaGrid, setCaptchaGrid] = useState([
    { id: 1, type: "stone", clicked: false, label: "Stone" },
    { id: 2, type: "rice", clicked: false, label: "Government Rice" },
    { id: 3, type: "stone", clicked: false, label: "Ash" },
    { id: 4, type: "rice", clicked: false, label: "Basmati" },
    { id: 5, type: "pebble", clicked: false, label: "Granite Pebble" },
    { id: 6, type: "rice", clicked: false, label: "Subsidized Rice" },
    { id: 7, type: "pebble", clicked: false, label: "Marble" },
    { id: 8, type: "rice", clicked: false, label: "Rice Husk" },
    { id: 9, type: "stone", clicked: false, label: "Coarse Gravel" },
  ]);
  const [captchaMsg, setCaptchaMsg] = useState("Select all government-sanctioned grains of rice. Do NOT select capitalist pebbles.");
  
  // Step 3: DNA Helix Drawing Pad
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dnaScore, setDnaScore] = useState(0);
  const [dnaAttempts, setDnaAttempts] = useState(0);
  const [dnaSuccess, setDnaSuccess] = useState(false);
  
  // Step 4: Spit Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [spitStatus, setSpitStatus] = useState<"idle" | "scanning" | "failed" | "success">("idle");
  const [spitTries, setSpitTries] = useState(0);

  // Step 5: Confirmation loops
  const [confirmStage, setConfirmStage] = useState(0);
  const [btnYesPos, setBtnYesPos] = useState({ x: 0, y: 0 });

  const addRage = (amt = 8) => setRage(r => Math.min(100, r + amt));

  // Step 1 income shifts randomly to frustrate the user
  useEffect(() => {
    if (step !== "quota") return;
    const t = setInterval(() => {
      setIncome(prev => {
        const delta = Math.floor((Math.random() - 0.5) * 1500);
        const next = Math.max(1000, Math.min(100000, prev + delta));
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [step]);

  // Adjust income feedback
  useEffect(() => {
    if (income > 50000) {
      setIncomeFeedback("🚨 SUSPICIOUSLY WEALTHY: You are too rich for subsidised grains. Income Tax department notified.");
    } else if (income < 5000) {
      setIncomeFeedback("⚠️ SUSPICIOUSLY IMPOVERISHED: Income is below national breathing limit. Please declare asset sources.");
    } else {
      setIncomeFeedback("✅ INCOME ACCEPATABLE (for now, pending physical audit by district supervisor)");
    }
  }, [income]);

  // Step 3 drawing canvas initialisation
  useEffect(() => {
    if (step !== "dna") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background guide double helix
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.15)";
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    for (let x = 10; x < canvas.width - 10; x++) {
      const y1 = canvas.height / 2 + Math.sin(x * 0.05) * 40;
      if (x === 10) ctx.moveTo(x, y1);
      else ctx.lineTo(x, y1);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x = 10; x < canvas.width - 10; x++) {
      const y2 = canvas.height / 2 - Math.sin(x * 0.05) * 40;
      if (x === 10) ctx.moveTo(x, y2);
      else ctx.lineTo(x, y2);
    }
    ctx.stroke();

    ctx.setLineDash([]);
  }, [step]);

  // Captcha grid click handler
  const handleCaptchaClick = (id: number) => {
    addRage(2);
    setCaptchaGrid(prev =>
      prev.map(c => (c.id === id ? { ...c, clicked: !c.clicked } : c))
    );
  };

  const verifyCaptcha = () => {
    addRage(4);
    const selected = captchaGrid.filter(c => c.clicked);
    const allRiceSelected = captchaGrid.every(c => c.type !== "rice" || c.clicked);
    const noStoneSelected = selected.every(c => c.type === "rice");

    if (allRiceSelected && noStoneSelected) {
      setCaptchaMsg("SUCCESS. Navigating to next trap...");
      setTimeout(() => setStep("dna"), 1500);
    } else {
      setCaptchaMsg("FAIL! You selected unpatriotic stones or missed government grains. Refreshing grid with harder stones...");
      setCaptchaGrid(prev =>
        [...prev].sort(() => Math.random() - 0.5).map(c => ({ ...c, clicked: false }))
      );
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const calculateDnaAlignment = () => {
    setDnaAttempts(a => a + 1);
    addRage(6);
    // Simulated chaotic alignment score
    const score = Math.floor(Math.random() * 20) + 70; // 70-89%
    setDnaScore(score);

    if (score >= 98) {
      setDnaSuccess(true);
      setTimeout(() => setStep("spit"), 1800);
    } else {
      alert(`DNA Alignment score: ${score}%. Re-verify failed. Your drawn strand matches 94% with a Common Banana (musa acuminata). Real citizens are not bananas.`);
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Spit file upload handlers
  const handleSpitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadError("");
    setSpitStatus("scanning");
    setSpitTries(t => t + 1);
    addRage(8);

    setTimeout(() => {
      if (!file.name.endsWith(".spit")) {
        setSpitStatus("failed");
        setUploadError("ERROR [Code X-809]: Invalid somatic fluid structure. Only saliva (.spit) files accepted. Ensure saliva is fresh.");
      } else {
        // Mock genetic analysis
        const samples = [
          "Saliva scan failure: Traces of chocolate and caffeine detected. Saliva rejected due to unpatriotic dietary profile. Fast for 24 hours.",
          "Saliva scan failure: DNA density mismatch. Are you a domestic cattle? Upload human saliva only.",
          "Saliva scan failure: Detected traces of happiness. Government welfare requires proof of extreme bureaucratic grief."
        ];
        
        if (spitTries < 2) {
          setSpitStatus("failed");
          setUploadError(samples[Math.floor(Math.random() * samples.length)]);
        } else {
          setSpitStatus("success");
          setTimeout(() => setStep("confirm"), 1500);
        }
      }
    }, 3000);
  };

  // Yes button escapes inside confirmation stage
  const handleYesHover = () => {
    if (confirmStage < 3) {
      const offsetX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 80 + 40);
      const offsetY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 50 + 20);
      setBtnYesPos({ x: offsetX, y: offsetY });
      addRage(3);
    }
  };

  const handleYesClick = () => {
    if (confirmStage < 3) {
      setConfirmStage(prev => prev + 1);
      setBtnYesPos({ x: 0, y: 0 });
    } else {
      setShowLoader(true);
      setLoaderMessages([
        "Connecting to District Food Inspector...",
        "Validating saliva density hashes...",
        "Checking if you drew a double-helix or a snake...",
        "Adding you to leap-year grain queue...",
        "Applying cow saliva standardisation override...",
        "Finishing certificate compilation... almost...",
        "Ration card successfully lost! Compiling backup...",
        "Subsidised Rice quota approved! (0.0005 grams per year)"
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefae0] text-[#283618] flex flex-col font-mono relative">
      
      {/* Fake full-screen processing loader */}
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

      {/* Header */}
      <header className="bg-[#606c38] text-[#fefae0] p-4 border-b-4 border-[#283618] flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest">🌾 ONLINE RATION CARD PORTAL</h1>
          <p className="text-[10px] text-green-200">Authorized by the National Subsidised Nutrition Authority | SUFFER-ACT 2024</p>
        </div>
        <div className="flex items-center gap-4">
          <SessionTimer />
          <button onClick={() => router.push("/dashboard")} className="gov-btn-secondary py-1 text-xs text-yellow-400">
            ← DASHBOARD
          </button>
        </div>
      </header>

      {/* Progress timeline */}
      <div className="bg-[#dde5b6] px-6 py-2 border-b border-[#283618] flex gap-2 overflow-x-auto text-[10px] font-black">
        {[
          { key: "quota", label: "1. Demand quota" },
          { key: "captcha", label: "2. Grains Captcha" },
          { key: "dna", label: "3. DNA Drawing" },
          { key: "spit", label: "4. Spit Upload" },
          { key: "confirm", label: "5. Interrogation" },
          { key: "done", label: "6. Failure" }
        ].map((s, idx) => (
          <div key={s.key} className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-0.5 border ${step === s.key ? "bg-[#283618] text-white" : "bg-[#fefae0]"}`}>
              {s.label}
            </span>
            {idx < 5 && <span className="opacity-50">→</span>}
          </div>
        ))}
      </div>

      <div className="flex-1 p-6 grid grid-cols-4 gap-6">
        
        {/* Left Ad Sidebar */}
        <div className="col-span-1 space-y-4">
          <div className="bg-[#dde5b6] p-3 border-2 border-dashed border-[#283618] text-[9px] leading-relaxed">
            <h3 className="font-black text-[11px] mb-1 uppercase text-red-700">🌾 EMERGENCY CITIZEN ALERTS</h3>
            <p className="mb-2">• All grain quotas under 1 gram must be picked up personally from the central godown in Srinagar.</p>
            <p className="mb-2">• Standard grain price is pegged to daily stock exchange indices. Expect 400% spikes.</p>
            <p>• Linking Aadhaar card with local grocer is mandatory before buying subsidised salt.</p>
          </div>
          <UnhingedAd type="sidebar" onAction={addRage} />
          <div className="bg-black text-[#00ff41] p-3 rounded border-4 border-gray-600 font-mono text-[9px] shadow-inner">
            <div>&gt; STRESS_LEVEL: {rage}%</div>
            <div>&gt; SUBSIDY_STATUS: STALLING</div>
            <div>&gt; DNA_MATCH: BANANA_DETECTED</div>
          </div>
        </div>

        {/* Center Application Form Area */}
        <div className="col-span-2">
          <AnimatePresence mode="wait">
            
            {/* ── STEP 1: QUOTA SELECTION ── */}
            {step === "quota" && (
              <motion.div
                key="quota"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="gov-card bg-white border-4 border-black p-6"
              >
                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-1">🌾 STEP 1: QUANTITY DEMAND</h2>
                <p className="text-xs text-gray-500 mb-2">Choose your monthly subsidized foodgrain quota. Limit is strictly enforced.</p>

                {/* Hot Single Forms Banner */}
                <div className="mb-4 border-2 border-black">
                  <Image src="/assets/ad_forms.png" alt="Forms Ad" width={400} height={120} className="w-full h-auto object-cover" />
                </div>

                {/* Microgram slider */}
                <div className="bg-gray-100 p-4 border-2 border-black mb-4">
                  <label className="block text-xs font-black mb-1">DEMANDED GRAIN (in micrograms):</label>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    value={micrograms}
                    onChange={e => { setMicrograms(Number(e.target.value)); addRage(1); }}
                    className="w-full h-3 bg-gray-300 border-2 border-black rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-gray-500">100,000 mcg (0.1g)</span>
                    <span className="text-lg font-black text-[#283618] blink underline">
                      {micrograms.toLocaleString()} mcg (~{(micrograms/1000000).toFixed(4)}g)
                    </span>
                    <span className="text-xs font-bold text-gray-500">10,000,000 mcg (10g)</span>
                  </div>
                  <p className="text-[9px] text-gray-500 italic mt-2">
                    *Maximum allowance is 10g of rice per family per year to support national grain preservation scheme.
                  </p>
                </div>

                {/* Shifting Income Input */}
                <div className="bg-red-50 p-4 border-2 border-[#283618] mb-6">
                  <label className="block text-xs font-black mb-1 text-red-800">
                    MONTHLY INCOME (₹):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={income}
                      onChange={e => { setIncome(Number(e.target.value)); addRage(2); }}
                      className="gov-input flex-1 text-lg font-black"
                    />
                    <button
                      onClick={() => { setIncome(12000); addRage(5); }}
                      className="gov-btn-secondary text-[10px] px-2"
                    >
                      RESET SHIFT
                    </button>
                  </div>
                  <p className="text-[10px] text-red-600 font-bold mt-2 leading-relaxed" suppressHydrationWarning>
                    {incomeFeedback}
                  </p>
                  <p className="text-[8px] text-gray-400 mt-1 italic">
                    Note: The income input is self-adjusting based on national bureaucratic inflation indices.
                  </p>
                </div>

                <button
                  onClick={() => { addRage(5); setStep("captcha"); }}
                  disabled={income > 50000}
                  className="gov-btn w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  PROCEED TO CAPTCHA <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: PEBBLE CAPTCHA ── */}
            {step === "captcha" && (
              <motion.div
                key="captcha"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-xl font-black text-red-700 uppercase tracking-widest mb-1">🌾 STEP 2: GRAIN INTEGRITY CAPTCHA</h2>
                <p className="text-xs text-gray-600 mb-4">{captchaMsg}</p>

                {/* Captcha grid */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
                  {captchaGrid.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleCaptchaClick(item.id)}
                      className={`h-20 border-2 border-black flex flex-col items-center justify-center cursor-pointer select-none text-[10px] font-black transition-all
                        ${item.clicked ? "bg-green-700 text-white border-green-400" : "bg-gray-100 text-black hover:bg-yellow-50"}`}
                    >
                      <div className="text-2xl mb-1">{item.type === "rice" ? "🌾" : "🪨"}</div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <button onClick={() => setStep("quota")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                  <button onClick={verifyCaptcha} className="gov-btn text-xs py-2 px-6">
                    VERIFY GRAINS →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: DNA HELIX DRAWING ── */}
            {step === "dna" && (
              <motion.div
                key="dna"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-xl font-black text-blue-900 mb-1 flex items-center justify-center gap-1">
                  <Dna className="animate-spin text-blue-800" size={24} /> STEP 3: DNA STRAND SIGNATURE
                </h2>
                <p className="text-xs text-gray-600 mb-2">
                  Draw your DNA double-helix signature in the canvas below.<br />
                  Accuracy threshold: <span className="text-red-600 font-bold blink">99%</span>
                </p>

                {/* Drawing board */}
                <div className="mx-auto border-4 border-black rounded bg-gray-50 relative overflow-hidden" style={{ width: 340, height: 200 }}>
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair absolute top-0 left-0 z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[8px] text-blue-900/30 font-bold select-none">
                    DRAW ALONG THE DOTTED PATH
                  </div>
                </div>

                <div className="mt-3 flex gap-2 justify-center text-xs">
                  <button
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext("2d");
                        ctx?.clearRect(0, 0, canvas.width, canvas.height);
                      }
                      addRage(4);
                    }}
                    className="gov-btn-secondary py-1 text-[10px]"
                  >
                    Clear Board
                  </button>
                  <button
                    onClick={calculateDnaAlignment}
                    className="gov-btn py-1 text-[10px]"
                  >
                    Scan & Verify DNA
                  </button>
                </div>

                {dnaAttempts > 0 && (
                  <div className="mt-4 bg-gray-100 p-3 border-2 border-black text-left text-[10px] space-y-1">
                    <p>&gt; LAST_ALIGNMENT: <span className="text-red-700 font-black">{dnaScore}%</span></p>
                    <p>&gt; STATUS: Rejects (Bananas detected)</p>
                    <p>&gt; TOTAL_SCAN_ATTEMPTS: {dnaAttempts}</p>
                    {dnaAttempts >= 3 && (
                      <p className="text-yellow-600 font-bold blink-fast">
                        💡 HINT: Click below to skip via Central Food Bribe (₹4,999 convenience charge).
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-3 justify-center">
                  <button onClick={() => setStep("captcha")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                  {dnaAttempts >= 3 && (
                    <button
                      onClick={() => {
                        addRage(15);
                        alert("Bribe accepted! DNA marked as conditionally patriotic. Proceeding to bodily fluid validation.");
                        setStep("spit");
                      }}
                      className="gov-btn text-xs py-2 px-4 bg-yellow-600 border-yellow-400"
                    >
                      SKIP VIA BRIBE (₹4,999) →
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: SPIT LIQUID UPLOAD ── */}
            {step === "spit" && (
              <motion.div
                key="spit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-xl font-black text-red-700 mb-1 flex items-center justify-center gap-1">
                  💧 STEP 4: BODILY FLUID VALIDATION
                </h2>
                <p className="text-xs text-gray-600 mb-2">
                  Drag and drop a fresh saliva sample file ending in <span className="text-blue-700 font-black">.spit</span> to verify genetic purity.
                </p>

                {/* Buffalo Aadhaar Banner */}
                <div className="mb-4 border-2 border-black max-w-sm mx-auto">
                  <Image src="/assets/ad_buffalo.png" alt="Buffalo Ad" width={320} height={100} className="w-full h-auto object-cover" />
                </div>

                {/* Upload drag drop box */}
                <div className="border-4 border-dashed border-[#283618] bg-yellow-50 p-6 flex flex-col items-center justify-center relative cursor-pointer hover:bg-yellow-100 transition-colors">
                  <input
                    type="file"
                    onChange={handleSpitUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileUp size={44} className="text-[#606c38] mb-2 animate-bounce" />
                  <p className="text-xs font-black">DRAG FRESH SALIVA FILE HERE</p>
                  <p className="text-[9px] text-gray-500 mt-1">Accepts strictly: .spit, .mucus formats only</p>
                </div>

                {spitStatus === "scanning" && (
                  <div className="mt-4 text-xs font-bold text-blue-700 blink">
                    <RefreshCw className="animate-spin inline mr-1" size={12} />
                    Analysing saliva sample for unpatriotic traces... Hold breath.
                  </div>
                )}

                {spitStatus === "failed" && (
                  <div className="mt-4 bg-red-50 border-2 border-red-700 p-3 text-left text-[10px] text-red-800 font-bold">
                    {uploadError}
                    <button
                      onClick={() => {
                        addRage(12);
                        alert("Cow spit override applied. Match verification: 99.8% (Cattle standard). Proceeding.");
                        setStep("confirm");
                      }}
                      className="w-full mt-2 bg-[#283618] text-white py-1 border border-black text-[9px] font-black uppercase"
                    >
                      Bypass: Submit cow saliva (.spit) instead
                    </button>
                  </div>
                )}

                <div className="mt-4 text-left text-[9px] text-gray-500">
                  <p>How to spit: Right-click desktop, click New Text Document, name it <strong>spit.spit</strong>, upload it. We will scan your monitor to gather saliva.</p>
                </div>

                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setStep("dna")} className="gov-btn-secondary text-xs py-2 px-4">
                    ← BACK
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: INTERROGATION CHAIN ── */}
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <h2 className="text-2xl font-black text-red-700 mb-2">🛑 DECREE CONFIRMATION</h2>
                <div className="text-5xl mb-3 shake">🤨</div>

                {confirmStage === 0 && (
                  <>
                    <h3 className="text-sm font-black mb-1 uppercase text-[#283618]">INTERROGATION STAGE 1</h3>
                    <p className="text-xs text-gray-700 font-bold mb-6">
                      Are you absolutely sure you deserve subsidized grains? Do you promise not to feed government rice to local birds?
                    </p>
                  </>
                )}
                {confirmStage === 1 && (
                  <>
                    <h3 className="text-sm font-black mb-1 uppercase text-[#283618]">INTERROGATION STAGE 2</h3>
                    <p className="text-xs text-gray-700 font-bold mb-6">
                      Confirming again: If we find stones in your grains, do you promise not to file complaints with the consumer court?
                    </p>
                  </>
                )}
                {confirmStage === 2 && (
                  <>
                    <h3 className="text-sm font-black mb-1 uppercase text-[#283618]">INTERROGATION STAGE 3</h3>
                    <p className="text-xs text-gray-700 font-bold mb-6">
                      Final check: By clicking YES below, you authorize the central grocer to link your sibling's school grade card to your grain quota.
                    </p>
                  </>
                )}
                {confirmStage === 3 && (
                  <>
                    <h3 className="text-lg font-black mb-1 uppercase text-red-700 blink">WARNING: LAST CHANCE</h3>
                    <p className="text-xs text-red-800 font-bold mb-6 leading-relaxed">
                      Clicking 'NO' will immediately delete your spit sample and report lack of hunger to the district inspector. Clicking 'YES' confirms compliance.
                    </p>
                  </>
                )}

                <div className="flex flex-col gap-2 relative">
                  <motion.button
                    onMouseEnter={handleYesHover}
                    onClick={handleYesClick}
                    animate={{ x: btnYesPos.x, y: btnYesPos.y }}
                    transition={{ type: "spring", stiffness: 450, damping: 12 }}
                    className="gov-btn w-full py-3 text-sm font-black uppercase shadow-md bg-green-700"
                  >
                    {confirmStage === 3 ? "YES, I COMPLY" : "YES, I AM A PATRIOTIC CITIZEN"}
                  </motion.button>
                  <button
                    onClick={() => {
                      alert("Grievance recorded. Deleting saliva sample. Re-initializing Step 1 quota selection.");
                      setStep("quota");
                      setConfirmStage(0);
                      addRage(25);
                    }}
                    className="gov-btn-secondary w-full py-2 text-xs uppercase"
                  >
                    NO, I WISH TO RESTART AND LOGOUT
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 6: DONE ── */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="gov-card bg-white border-4 border-black p-6 text-center"
              >
                <div className="text-7xl mb-4 float">📄</div>
                <h2 className="text-2xl font-black text-green-700 mb-2 uppercase">RATION CARD GENERATED!</h2>
                <p className="text-xs text-gray-600 mb-4 font-bold">
                  Congratulations! Your subsidised nutritional profile has been recorded in the central server.
                </p>

                <div className="bg-[#dde5b6] p-4 text-left border-2 border-black text-xs space-y-1 relative overflow-hidden mb-6">
                  {/* Watermark */}
                  <div className="absolute right-[-20px] bottom-[-25px] opacity-10 font-mono text-8xl font-black uppercase select-none -rotate-12">
                    FAKE
                  </div>
                  <p><span className="font-black">Card Number:</span> <span className="font-bold">RC-9831-BANANA-OVERRIDE</span></p>
                  <p><span className="font-black">Selected Quota:</span> <span className="text-green-800 font-bold" suppressHydrationWarning>{(micrograms/1000000).toFixed(6)} grams</span></p>
                  <p><span className="font-black">Saliva Status:</span> <span className="text-red-700 font-black">CATTLE LEVEL SPECIFIED</span></p>
                  <p><span className="font-black">Pickup Location:</span> <span className="text-blue-900 font-bold">Counter 3, Srinagar Central Godown</span></p>
                  <p className="text-[9px] text-gray-500 font-bold mt-2 italic">
                    Note: Counter 3 is open from 10:00 AM to 10:01 AM on alternative leap years. Please bring 4 witnesses.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="gov-btn flex-1 text-xs" onClick={() => router.push("/apply/passport")}>
                    APPLY PASSPORT (NEXT TRAP) →
                  </button>
                  <button className="gov-btn-secondary flex-1 text-xs" onClick={() => router.push("/dashboard")}>
                    BACK TO DASHBOARD
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Column Ads / Entertainment */}
        <div className="col-span-1 space-y-4">
          <UnhingedAd type="sidebar" onAction={addRage} />
          
          <div className="bg-[#606c38] text-[#fefae0] p-4 border-4 border-[#283618] text-center shadow-lg">
            <h3 className="font-black text-xs mb-1 uppercase">💡 CITIZEN HELPLINE</h3>
            <p className="text-[9px] leading-tight mb-2">Need grains urgently? Pay instant fast-track shipping bribe directly to our chatbot SEVA-BOT. SEVA-BOT is currently offline.</p>
            <button
              onClick={() => alert("Grievance successfully lost. Thank you for your feedback.")}
              className="w-full bg-[#fefae0] text-[#283618] py-1 border border-black text-[9px] font-black uppercase active:translate-y-0.5"
            >
              ✍️ Call Grocer Inspector
            </button>
          </div>
        </div>

      </div>

      {/* Chatbot */}
      <ChatBot />

      {/* Footer */}
      <footer className="bg-[#606c38] text-[8px] text-center text-green-200 py-2 border-t-4 border-[#283618]">
        © 1947–2026 MINISTRY OF RATIONING AND GRAIN MISERY | CITIZEN RECORD: SUSPICIOUS | VERSION 0.1.0-CATTLE
      </footer>

    </div>
  );
}
