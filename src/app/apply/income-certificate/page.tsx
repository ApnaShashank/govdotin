"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileUp, CheckCircle, ArrowRight, ArrowLeft,
  RefreshCw, AlertCircle, Loader2,
} from "lucide-react";
import FakeLoader from "@/components/FakeLoader";
import SessionTimer from "@/components/SessionTimer";
import ChatBot from "@/components/ChatBot";

// ── State ──────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4 | 5;

const RANDOM_MANDATORY: string[] = [
  "Mother's maiden name's horoscope",
  "Childhood pet's zodiac sign",
  "Preferred shade of government beige",
  "Number of times you've cried at a bank",
  "Distance from nearest post office (in furlongs)",
];

const CONFIRMATION_CHAIN = [
  "Are you sure you want to submit?",
  "Really sure? This cannot be undone.",
  "Government-level sure?",
  "We will send your data to 47 departments. Still sure?",
  "Final confirmation: you accept all consequences including existential dread?",
  "ULTRA FINAL: Click OK to sacrifice 3 business years of your life.",
];

export default function IncomeCertificatePage() {
  const router = useRouter();
  const [step, setStep]   = useState<Step>(1);
  const [otp, setOtp]     = useState(["", "", "", "", "", ""]);
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
  const [timer, setTimer] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [mandatoryField] = useState(
    RANDOM_MANDATORY[Math.floor(Math.random() * RANDOM_MANDATORY.length)]
  );
  const [mandatoryVal, setMandatoryVal] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [confirmIdx, setConfirmIdx] = useState(0);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Shuffle OTP positions every 2.5s
  useEffect(() => {
    if (step !== 4) return;
    const t = setInterval(() => setOrder(o => [...o].sort(() => Math.random() - 0.5)), 2500);
    return () => clearInterval(t);
  }, [step]);

  // Timer counts UP on OTP step
  useEffect(() => {
    if (step !== 4) return;
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [step]);

  // Auto-save every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setSavedAt(new Date().toLocaleTimeString("en-IN"));
      }, 1200);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // ── Handlers ──
  const handleOtp = (posIdx: number, val: string) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const newOtp = [...otp];
    newOtp[order[posIdx]] = digit;
    setOtp(newOtp);
  };

  const confirmSubmit = () => {
    if (confirmIdx < CONFIRMATION_CHAIN.length) {
      if (window.confirm(CONFIRMATION_CHAIN[confirmIdx])) {
        setConfirmIdx(i => i + 1);
        if (confirmIdx + 1 >= CONFIRMATION_CHAIN.length) {
          setShowLoader(true);
        }
      }
    }
  };

  const handleNext = () => {
    if (step === 3) {
      if (!mandatoryVal.trim()) {
        alert(`ERROR: The field "${mandatoryField}" is mandatory. This was always mandatory. We just forgot to show it until now.`);
        return;
      }
      setStep(4);
    } else if (step === 4) {
      const entered = order.map(i => otp[i]).join("");
      if (entered === "123456") {
        confirmSubmit();
      } else {
        alert("INVALID OTP: The National OTP Server has determined that your fingers are lying. Please try again or verify your horoscope.");
      }
    } else if (step < 5) {
      setStep((step + 1) as Step);
    }
  };

  const mins = String(Math.floor(timer / 60)).padStart(2, "0");
  const secs = String(timer % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#ff00ff] flex flex-col items-center justify-center p-6 relative">

      {showLoader && (
        <FakeLoader
          durationMs={7000}
          messages={[
            "Submitting Form 420-B to National Server...",
            "Server at 99% capacity — queuing your misery...",
            "Verifying Aadhaar linkage for the 47th time...",
            "Checking if you have outstanding dues (you do)...",
            "Cross-referencing with 1947 census...",
            "Form successfully received! Just kidding. Error.",
            "Retrying submission (attempt 1 of ∞)...",
            "Something went wrong. Submitting anyway.",
          ]}
          onComplete={() => { setShowLoader(false); setStep(5); }}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a237e] border-b-4 border-yellow-400 px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wide">📋 FORM 420-B — INCOME CERTIFICATE</h1>
          <p className="text-[9px] text-blue-300">Application for Poverty Verification | Government of India</p>
        </div>
        <div className="flex items-center gap-3">
          {saving
            ? <span className="text-[9px] text-yellow-300 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Auto-saving...</span>
            : savedAt && <span className="text-[9px] text-green-400">✓ Saved at {savedAt} (to /dev/null)</span>
          }
          <SessionTimer />
        </div>
      </header>

      <div className="pt-16 w-full max-w-2xl">
        {/* Progress */}
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(s => (
            <div
              key={s}
              className={`flex-1 h-3 border border-black transition-all duration-500 ${
                step > s ? "bg-green-600" :
                step === s ? "bg-red-600 animate-pulse" :
                "bg-gray-300"}`}
            />
          ))}
        </div>

        <div className="gov-card">
          {/* Card header */}
          <div className="border-b-4 border-double border-blue-900 pb-3 mb-5 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-red-700">FORM 420-B</h2>
              <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Application for Income Certificate (Poverty Verification)</p>
            </div>
            <div className="text-right text-[9px]">
              <p className="font-bold" suppressHydrationWarning>SERIAL: {Math.random().toString(36).substring(2,8).toUpperCase()}</p>
              <p className="text-red-600 font-black">STATUS: SUFFERING</p>
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <motion.div key="s1" initial={{x:300,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-300,opacity:0}} className="space-y-4">
                <h3 className="text-lg font-black bg-yellow-300 inline-block px-2 uppercase">Section 1: Personal Disclosure</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">Legal Name <span className="text-red-600">*</span> (max 5 chars)</label>
                    <input type="text" maxLength={5} className="gov-input" placeholder="NAME" />
                    <p className="text-[8px] text-gray-400 mt-0.5">Full legal name must fit in 5 characters. Apologies to Krishnamurthy.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">Father's Middle Initial <span className="text-red-600">*</span></label>
                    <input type="text" className="gov-input bg-black text-white" placeholder="?" maxLength={1} />
                    <p className="text-[8px] text-gray-400 mt-0.5">If unknown, use ¿</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1 uppercase text-blue-900 italic">
                    Date of Birth <span className="text-red-600">*</span>
                    <span className="text-gray-400 font-normal ml-2">(scroll manually — we support 1947–1949 only)</span>
                  </label>
                  <div className="flex gap-2">
                    <select className="gov-input flex-1 text-xs">
                      {["1947","1948","1949"].map(y => <option key={y}>{y}</option>)}
                    </select>
                    <select className="gov-input flex-1 text-xs"><option>JANUARY</option></select>
                    <select className="gov-input flex-1 text-xs"><option>01</option></select>
                  </div>
                  <p className="text-[8px] text-red-600 font-bold mt-1">Only citizens born 1947–1949 are supported. Born after 1949? Please use our offline form (Form 420-B-OFFLINE-v3.2, available by fax only).</p>
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-2 uppercase text-blue-900">Income Range <span className="text-red-600">*</span> (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["₹0 – ₹10/year","₹11 – ₹15/year","Infinite (suspicious)","Negative (I owe the Earth)","In vibes","TBD"].map((opt,i) => (
                      <label key={i} className="flex items-center gap-2 text-xs border border-gray-300 p-2 hover:bg-yellow-50 cursor-pointer">
                        <input type="checkbox" /> {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">Caste Category <span className="text-red-600">*</span></label>
                  <select className="gov-input text-xs">
                    <option value="">-- Select Category --</option>
                    <option>General (pays extra)</option>
                    <option>OBC (Other Bureaucratic Casualty)</option>
                    <option>SC (Suffering Citizen)</option>
                    <option>ST (Suffering Tremendously)</option>
                    <option>EWS (Extremely Worn-out Soul)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Address ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{x:300,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-300,opacity:0}} className="space-y-4">
                <h3 className="text-lg font-black bg-green-300 inline-block px-2 uppercase">Section 2: Address (of Your Suffering)</h3>

                <div>
                  <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">House / Flat No. <span className="text-red-600">*</span></label>
                  <input type="text" className="gov-input" placeholder="e.g., Under a Bridge, Block C" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">District <span className="text-red-600">*</span></label>
                    <select className="gov-input text-xs">
                      <option>-- Select District (not alphabetical) --</option>
                      <option>Zzunga</option><option>Aapta</option><option>Morbhog</option>
                      <option>Pareshani Nagar</option><option>Dukh Pur</option>
                      <option>Takleef Town</option><option>Bekar Bazar</option>
                    </select>
                    <p className="text-[8px] text-gray-400 mt-0.5">Districts are not in alphabetical order. This is intentional.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">State <span className="text-red-600">*</span></label>
                    <select className="gov-input text-xs">
                      <option>Confusion Pradesh</option>
                      <option>West Denial</option>
                      <option>Uttar Pretense</option>
                      <option>Tamil Trauma</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">PIN Code <span className="text-red-600">*</span></label>
                    <input type="text" className="gov-input" placeholder="000000" maxLength={6} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">Taluk <span className="text-red-600">*</span></label>
                    <input type="text" className="gov-input" placeholder="???" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black mb-1 uppercase text-blue-900">Ward No. <span className="text-red-600">*</span></label>
                    <input type="number" className="gov-input" placeholder="1–999" min={1} max={999} />
                  </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-2 text-[9px]">
                  <p className="font-black text-red-700">⚠ ADDRESS VERIFICATION:</p>
                  <p>Your address will be verified by physically dispatching a government officer. Please ensure someone is home at all times. The officer may arrive between 1947 and 2047.</p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Documents ── */}
            {step === 3 && (
              <motion.div key="s3" initial={{x:300,opacity:0}} animate={{x:0,opacity:1}} exit={{x:-300,opacity:0}} className="space-y-4">
                <h3 className="text-lg font-black bg-blue-200 inline-block px-2 uppercase">Section 3: Document Torture</h3>

                {/* Upload zone */}
                <div
                  className="p-10 border-4 border-dashed border-gray-400 bg-gray-50 flex flex-col items-center justify-center relative group cursor-crosshair"
                  onClick={() => { setUploadError(""); }}
                >
                  <FileUp size={48} className="text-gray-300 group-hover:text-blue-400 transition-colors mb-3" />
                  <p className="text-sm font-bold text-center">DRAG & DROP YOUR DOCUMENTS HERE</p>
                  <p className="text-[9px] text-gray-400 italic mt-1">Accepted formats: .bmp only (must be between 50GB–51GB)</p>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-crosshair"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setUploadError("ERROR: File size too small. Please upload a file larger than 50GB. Also, only .bmp is accepted.");
                      }
                    }}
                  />
                </div>
                {uploadError && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-100 border-l-4 border-red-600 p-2 text-xs text-red-700 font-bold flex items-center gap-2">
                    <AlertCircle size={12} /> {uploadError}
                  </motion.div>
                )}

                {/* Required documents list */}
                <div className="bg-yellow-50 border-2 border-yellow-600 p-3 text-xs space-y-1">
                  <p className="font-black text-yellow-800 mb-2">REQUIRED DOCUMENTS (all mandatory):</p>
                  {[
                    "Aadhaar Card (original + 7 self-attested photocopies)",
                    "PAN Card (must be laminated in government-approved plastic only)",
                    "Ration Card (or equivalent emotional damage certificate)",
                    "Recent passport photo (taken on a Tuesday, sepia filter)",
                    "Blood type certificate (O+ only — others must convert)",
                    "Letter from your MLA confirming you exist",
                    "Recent electricity bill (must show negative units)",
                    "Childhood photo for comparison (pre-1985 mandatory)",
                  ].map((doc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <input type="checkbox" className="mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>

                {/* Surprise mandatory field — appears only on this step */}
                <div className="border-4 border-red-600 bg-red-50 p-4">
                  <p className="text-[9px] text-red-700 font-black mb-2 blink">⚠ NEWLY MANDATORY FIELD (added while you were filling the form):</p>
                  <label className="block text-xs font-black mb-1 text-red-800 uppercase">{mandatoryField} <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    className="gov-input border-red-400"
                    placeholder="This field appeared suddenly. Fill it."
                    value={mandatoryVal}
                    onChange={e => setMandatoryVal(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: OTP ── */}
            {step === 4 && (
              <motion.div key="s4" initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:1.5,opacity:0}} className="space-y-4 text-center">
                <h3 className="text-2xl font-black text-red-600 blink">⚡ CRITICAL OTP VERIFICATION</h3>
                <p className="text-sm text-gray-700">A 6-digit code was sent to your primary school landline.<br />Please ensure it is plugged in and the operator is available.</p>

                {/* Timer counts UP */}
                <div className={`text-xl font-black tabular-nums ${timer > 60 ? "text-red-600 blink" : "text-gray-700"}`}>
                  ⏱ {mins}:{secs} (and counting up)
                </div>

                {/* Shuffling OTP inputs */}
                <div className="flex justify-center gap-2">
                  {order.map((origIdx, posIdx) => (
                    <motion.div key={origIdx} layout transition={{type:"spring",stiffness:400,damping:30}}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[origIdx]}
                        onChange={e => handleOtp(posIdx, e.target.value)}
                        className={`w-12 h-14 text-center text-2xl font-black border-4 border-black gov-input transition-all
                          ${posIdx === 2 ? "upside-down" : ""}
                          ${otp[origIdx] ? "border-green-500 bg-green-50" : ""}
                        `}
                        placeholder="?"
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="text-[9px] text-gray-500 italic">Boxes shuffle every 2.5s. Box #3 is upside-down. This is a security feature. The answer is 1-2-3-4-5-6.</p>

                {/* CRT terminal */}
                <div className="crt-screen text-xs text-left mx-auto max-w-xs space-y-0.5">
                  <p>&gt; OTP_SENT: QUESTIONABLE</p>
                  <p>&gt; DELIVERY_METHOD: CARRIER PIGEON</p>
                  <p>&gt; PIGEON_STATUS: MISSING</p>
                  <p>&gt; HINT: The answer is 123456</p>
                  <p className="blink-fast">&gt; _</p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: Success ── */}
            {step === 5 && (
              <motion.div key="s5" initial={{y:500}} animate={{y:0}} transition={{type:"spring",stiffness:120}} className="text-center space-y-5 py-6">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                    <CheckCircle size={60} color="white" />
                  </div>
                </div>
                <h2 className="text-4xl font-black text-green-700">APPLICATION SUBMITTED!</h2>
                <p className="text-lg font-bold text-gray-700">Your form has been successfully <span className="text-red-600 underline">lost</span> in our database.</p>

                <div className="bg-gray-50 border-2 border-dashed border-gray-400 p-4 text-xs text-left space-y-1">
                  <p><strong>Application No:</strong> <span suppressHydrationWarning>{Math.random().toString(36).substring(2,10).toUpperCase()}</span></p>
                  <p><strong>Transaction ID:</strong> 0xBAD_UX_IS_MY_PASSION</p>
                  <p suppressHydrationWarning><strong>Submitted at:</strong> {new Date().toLocaleString("en-IN")}</p>
                  <p><strong>Expected Processing:</strong> 3,421 working days</p>
                  <p><strong>Status:</strong> <span className="text-red-600 font-black">UNDER REVIEW (since the moment you submitted)</span></p>
                </div>

                <button
                  className="gov-btn w-full text-lg flex items-center justify-center gap-2"
                  onClick={() => {
                    if (confirmIdx < CONFIRMATION_CHAIN.length) {
                      if (window.confirm("Are you sure you want to download the receipt?")) {
                        if (window.confirm("Really? This will use 0.0001% of the National Internet Quota.")) {
                          if (window.confirm("FINAL WARNING: Downloading may cause spontaneous cursor combustion.")) {
                            alert("ERROR 0x8004: Printer out of virtual ink.\n\nPlease refill your monitor.\n\nAlternatively, download the receipt as a .bmp file from our offline portal.\n\nOffline portal is also offline.");
                          }
                        }
                      }
                    }
                  }}
                >
                  DOWNLOAD CERTIFICATE <RefreshCw size={20} className="animate-spin" />
                </button>

                <Link href="/queue" className="block text-sm text-blue-700 underline hover:text-red-600">
                  Check your queue position → (it's 47,321)
                </Link>
                <Link href="/dashboard" className="block text-xs text-gray-400 underline">
                  Back to Dashboard (why would you?)
                </Link>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="mt-8 pt-5 border-t-2 border-black flex items-center justify-between">
              {step > 1
                ? <button onClick={() => setStep((step - 1) as Step)} className="gov-btn-secondary flex items-center gap-2">
                    <ArrowLeft size={14} /> BACK (LOSE UNSAVED PROGRESS)
                  </button>
                : <div />
              }
              <div className="text-[9px] text-gray-400">Step {step} of 4</div>
              <button onClick={handleNext} className="gov-btn flex items-center gap-2 animate-pulse">
                {step === 4 ? "SUBMIT & SUFFER" : "CONTINUE SUFFERING"} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed corner notice */}
      <div className="fixed top-20 right-4 z-30 bg-yellow-400 border-2 border-black p-2 text-[9px] font-black max-w-[180px] shadow shake-hover">
        NOTICE: YOUR BROWSER IS COMPATIBLE BUT YOUR ATTITUDE IS NOT.
      </div>

      <ChatBot />
    </div>
  );
}
