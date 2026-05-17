"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import RageMeter from "@/components/RageMeter";
import SessionTimer from "@/components/SessionTimer";
import ChatBot from "@/components/ChatBot";
import Popup from "@/components/Popup";
import FakeLoader from "@/components/FakeLoader";
import {
  Bell, AlertTriangle, ChevronDown, ChevronRight,
  FileText, HelpCircle, Loader2, RefreshCw,
} from "lucide-react";

const DECREES = [
  "Decree #2024: All left-handed typing now taxed at 400%",
  "Decree #2025: Blinking is mandatory — fine for not blinking every 4 seconds",
  "Decree #2026: Thoughts are now taxable if unsubmitted by Form T-42",
  "Decree #2027: Wifi password must now match your Aadhaar number",
  "Decree #2028: Citizens must clap when government websites load",
  "Decree #2029: PDF is now the official national language",
  "Decree #2030: Ctrl+Z is banned — no undoing your citizenship",
  "Decree #2031: All passwords must be submitted to local post office annually",
];

const POPUP_TEMPLATES = [
  { title: "SESSION WARNING", body: "Your session will expire. It always does. Click OK to delay by 0.3 seconds.", tiny: false },
  { title: "VIRUS DETECTED!!!", body: "A dangerous file 'your_hope.exe' has been quarantined. Install GovAntivirus Pro™ (₹4,999/year) to restore.", tiny: true },
  { title: "MANDATORY UPDATE", body: "Please update your browser to Internet Explorer 6. Modern browsers are not patriotic.", tiny: false },
  { title: "OTP NOT SENT", body: "OTP was sent to your registered mobile number ending in ****. Please note: we don't have your number.", tiny: true },
  { title: "🎉 CONGRATULATIONS!", body: "You are the 1,00,00,000th visitor! You have won a government form. Please fill it.", tiny: false },
  { title: "AADHAAR ALERT", body: "Your Aadhaar has been linked to someone else's ration card. This is a feature, not a bug.", tiny: true },
];

const SERVICES = [
  { label: "Income Certificate", href: "/apply/income-certificate", color: "bg-red-700", emoji: "📋", desc: "Prove you are poor" },
  { label: "OTP Verification", href: "/otp", color: "bg-blue-700", emoji: "🔢", desc: "Enter numbers that move" },
  { label: "Aadhaar Verify", href: "/verify", color: "bg-green-800", emoji: "👁️", desc: "Biometric humiliation" },
  { label: "Check Queue", href: "/queue", color: "bg-purple-800", emoji: "🕐", desc: "Position: 47,321" },
  { label: "Help / FAQ", href: "/help", color: "bg-orange-700", emoji: "❓", desc: "Won't actually help" },
  { label: "Birth Certificate", href: "#", color: "bg-gray-700", emoji: "👶", desc: "404: Life not found" },
  { label: "Ration Card", href: "#", color: "bg-yellow-700", emoji: "🍚", desc: "Submit DNA first" },
  { label: "Passport", href: "#", color: "bg-teal-700", emoji: "🛂", desc: "Server down since 2018" },
];

const NOTIFICATIONS = [
  "Your document 'hope.pdf' could not be uploaded. File too large (0 KB).",
  "Form 16-B has been reset. All progress lost. We are sorry for the convenience.",
  "Mandatory webinar: 'How to Use This Portal' — Link broken",
  "Your grievance #GR-2019-001 is under review (since 2019).",
  "Password expires in 0 days. It already expired while you read this.",
  "Please re-verify your Aadhaar. Again. Yes, again.",
  "New scheme announced: PM SUFFER YOJANA — Apply now (server down)",
];

export default function DashboardPage() {
  const router = useRouter();
  const [rage, setRage] = useState(12);
  const [popups, setPopups] = useState<typeof POPUP_TEMPLATES>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [navLinks, setNavLinks] = useState(SERVICES);
  const [ticker, setTicker] = useState(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [logoutStage, setLogoutStage] = useState(0);
  const [showLogoutLoader, setShowLogoutLoader] = useState(false);

  const addRage = (amount = 8) => setRage(r => Math.min(100, r + amount));

  // Spawn popups periodically
  useEffect(() => {
    const t = setInterval(() => {
      if (popups.length < 4) {
        const random = POPUP_TEMPLATES[Math.floor(Math.random() * POPUP_TEMPLATES.length)];
        setPopups(prev => [...prev, random]);
        addRage(5);
      }
    }, 6000);
    return () => clearInterval(t);
  }, [popups]);

  // Auto-save spinner every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setAutoSaving(true);
      setTimeout(() => setAutoSaving(false), 1200);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Shuffle nav destinations randomly every 15s
  useEffect(() => {
    const t = setInterval(() => {
      setNavLinks(prev => [...prev].sort(() => Math.random() - 0.5));
    }, 15000);
    return () => clearInterval(t);
  }, []);

  // Ticker
  useEffect(() => {
    const t = setInterval(() => setTicker(i => (i + 1) % DECREES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const removePopup = (i: number) => {
    setPopups(prev => prev.filter((_, idx) => idx !== i));
    addRage(3);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setLogoutStage(1);
    addRage(10);
  };

  const nextLogoutStage = () => {
    if (logoutStage < 3) {
      setLogoutStage(logoutStage + 1);
      addRage(5);
    } else {
      setLogoutStage(0);
      setShowLogoutLoader(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000080] text-[#ffff00]" onClick={() => addRage(1)}>

      {/* ── SESSION EXPIRED MODAL ── */}
      <AnimatePresence>
        {sessionExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          >
            <div className="gov-card text-center max-w-sm w-full mx-4">
              <div className="text-5xl mb-4 blink">⏱️</div>
              <h2 className="text-2xl font-black text-red-700 mb-2">SESSION EXPIRED</h2>
              <p className="text-sm text-gray-700 mb-4">
                Your session expired due to inactivity. All your progress has been deleted.<br />
                <span className="text-[10px] italic text-gray-400">(There was no progress to save anyway.)</span>
              </p>
              <button onClick={() => { setSessionExpired(false); setRage(rage + 20); }} className="gov-btn w-full">
                START OVER 😭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="bg-red-700 border-b-4 border-yellow-400 px-4 py-3 flex items-center gap-4 flex-wrap">
        <Image src="/assets/logo.png" alt="logo" width={44} height={44} className="invert shrink-0" />
        <div>
          <h1 className="text-lg font-black italic uppercase leading-tight tracking-wider">
            CITIZEN PORTAL v0.0.1-ALPHA
          </h1>
          <p className="text-[9px] text-red-200">Ministry of Digital Suffering | Authorized by no one in particular</p>
        </div>
        <div className="ml-auto flex items-center gap-3 flex-wrap justify-end">
          {autoSaving && (
            <span className="text-[10px] flex items-center gap-1 text-yellow-200">
              <Loader2 size={10} className="animate-spin" /> Auto-saving...
            </span>
          )}
          <RageMeter value={rage} />
          <SessionTimer onExpire={() => setSessionExpired(true)} />
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setNotifOpen(o => !o); addRage(2); }}
              className="relative p-2 bg-black border-2 border-yellow-400"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center blink">
                57
              </span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="absolute right-0 top-full mt-1 w-72 bg-white border-2 border-black z-50 shadow-lg"
                >
                  <div className="window-bar"><span>NOTIFICATIONS (57)</span><button className="window-close" onClick={() => setNotifOpen(false)}>×</button></div>
                  <div className="max-h-48 overflow-y-auto">
                    {NOTIFICATIONS.map((n, i) => (
                      <div key={i} className="p-2 border-b border-gray-200 text-xs text-black hover:bg-yellow-50 cursor-pointer" onClick={() => alert("Cannot open notification. Server busy.")}>
                        🔴 {n}
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center text-[9px] text-gray-500 bg-gray-100">
                    Showing 7 of 57. The rest are too depressing.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={ticker}
            initial={{ x: "100vw" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 14, ease: "linear" }}
            className="ticker-content"
          >
            📋 {DECREES[ticker]} &nbsp;|&nbsp; 📋 {DECREES[(ticker + 1) % DECREES.length]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-1 overflow-x-auto">
        {/* ── SIDEBAR ── */}
        <aside className="w-56 bg-green-900 p-3 border-r-4 border-red-600 shrink-0 flex flex-col gap-2">
          <div className="bg-yellow-400 text-black font-black text-center text-xs py-2 -rotate-1 shadow mb-2">
            WELCOME, CITIZEN #9421-B
          </div>

          <Link href="/dashboard" className="block p-2 bg-blue-700 border border-white text-[11px] hover:bg-white hover:text-blue-700 transition-colors">
            🏠 DASHBOARD
          </Link>

          {/* Nested dropdown */}
          <div>
            <button
              className="w-full text-left p-2 bg-purple-700 border border-white flex justify-between items-center text-[11px] hover:bg-purple-500"
              onClick={() => { setApplyOpen(o => !o); addRage(3); }}
            >
              📄 APPLY FOR STUFF <ChevronDown size={12} className={`transition-transform ${applyOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {applyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-purple-900 border border-purple-700"
                >
                  {[
                    { label: "Income Certificate", href: "/apply/income-certificate" },
                    { label: "Birth Certificate", href: "#", note: "(404)" },
                    { label: "Ration Card", href: "#", note: "(DNA reqd)" },
                    { label: "Death Certificate", href: "#", note: "(ironic)" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className="block px-4 py-1.5 text-[9px] hover:bg-purple-600 border-b border-purple-800"
                      onClick={() => addRage(4)}
                    >
                      <ChevronRight size={8} className="inline mr-1" />
                      {item.label} <span className="text-gray-400">{item.note}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/queue" className="block p-2 bg-indigo-700 border border-white text-[11px] hover:bg-white hover:text-indigo-700 transition-colors" onClick={() => addRage(2)}>
            🕐 CHECK QUEUE
          </Link>
          <Link href="/verify" className="block p-2 bg-teal-700 border border-white text-[11px] hover:bg-white hover:text-teal-700 transition-colors text-right rotate-1" onClick={() => addRage(2)}>
            👁️ AADHAAR VERIFY
          </Link>
          <Link href="/help" className="block p-2 bg-orange-700 border border-white text-[11px] hover:bg-white hover:text-orange-700 transition-colors" onClick={() => addRage(2)}>
            ❓ HELP (lol)
          </Link>
          <Link href="#" className="block p-2 bg-pink-700 border border-white text-[11px] text-right -rotate-1" onClick={e => { e.preventDefault(); addRage(10); alert("Settings are read-only. Please submit Form S-99 to request settings access."); }}>
            ⚙️ SETTINGS (LOCKED)
          </Link>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-700 border border-white text-center font-black text-[11px] hover:bg-red-500 uppercase"
            >
              🚪 LOGOUT (EXIT TRAP)
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 p-6 min-w-[900px] space-y-6">

          {/* Welcome bar */}
          <div className="bg-yellow-400 text-black border-4 border-black p-3 flex items-center justify-between">
            <div>
              <p className="font-black text-sm">🙏 Welcome, CITIZEN #9421-B</p>
              <p className="text-[10px]">Citizenship Status: <span className="font-bold text-red-700">Pending Approval since 1984</span></p>
            </div>
            <div className="text-right text-[10px]">
              <p>Last Login: Never successfully</p>
              <p>Failed Attempts: 47</p>
            </div>
          </div>

          {/* Service Grid */}
          <div>
            <h2 className="text-lg font-black mb-3 flex items-center gap-2">
              <FileText size={18} /> CITIZEN SERVICES
              <span className="text-[9px] text-gray-400 font-normal ml-2">(links may shuffle every 15 seconds)</span>
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {navLinks.map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  onClick={() => addRage(3)}
                  className={`${s.color} border-2 border-white p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-all hover:scale-95 text-center`}
                >
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="font-black text-xs">{s.label}</span>
                  <span className="text-[9px] opacity-70">{s.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Status + Ad row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Citizen status */}
            <div className="col-span-2 bg-white text-black border-4 border-black p-4">
              <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                <Bell size={16} className="text-red-600" /> YOUR CITIZEN STATUS
              </h3>
              <div className="flex gap-4 items-center border-2 border-gray-300 p-3 bg-gray-50">
                <div className="w-16 h-16 bg-gray-400 border-4 border-black flex items-center justify-center text-2xl font-black shrink-0">?</div>
                <div className="flex-1">
                  <p className="font-black">NAME: [REDACTED BY ORDER OF MINISTRY]</p>
                  <p className="text-xs text-gray-600">Verification Progress:</p>
                  <div className="w-full bg-gray-300 h-3 border border-black mt-1 relative overflow-hidden">
                    <div className="bg-green-600 h-full animate-pulse" style={{ width: "12%" }}></div>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1">12% complete — Est. completion: 14 years, 3 months</p>
                </div>
                <button
                  className="gov-btn-secondary text-[9px] py-1 px-2"
                  onClick={() => { addRage(15); alert("Re-verification requires you to submit Form AA-47 in person at the New Delhi HQ. Dress code: formal."); }}
                >
                  RE-VERIFY
                </button>
              </div>

              {/* More fake status fields */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[9px]">
                {[
                  ["CIBIL Score", "ERROR: Negative"],
                  ["Tax Status", "WANTED"],
                  ["Aadhaar Link", "Linked to wrong person"],
                  ["PAN Card", "Lost in transit (2016)"],
                  ["Ration Card", "Pending DNA submission"],
                  ["Voter ID", "Vote recorded for candidate you didn't choose"],
                ].map(([k, v], i) => (
                  <div key={i} className="flex justify-between border-b border-gray-200 py-1">
                    <span className="font-bold text-gray-700">{k}:</span>
                    <span className="text-red-600 font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fake ad */}
            <div
              className="bg-yellow-400 border-4 border-red-600 p-3 cursor-pointer flex flex-col items-center justify-center shake-hover"
              onClick={() => { addRage(5); alert("Congratulations! You have won absolutely nothing. This is a government website."); }}
            >
              <Image src="/assets/ad.png" alt="ad" width={300} height={150} className="w-full h-auto mb-2" />
              <p className="text-[10px] font-black text-red-700 text-center blink">
                🏆 YOU WON IPHONE 27!!<br />TAP TO CLAIM NOW!!!
              </p>
              <p className="text-[7px] text-center mt-1 text-gray-700">
                *Terms apply. Offer valid for citizens born in 1947 only.
              </p>
            </div>
          </div>

          {/* Decrees */}
          <div>
            <h3 className="text-lg font-black mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> LATEST GOVERNMENT DECREES
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {DECREES.map((d, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.03, rotate: (i % 2 === 0 ? 1 : -1) }}
                  className="p-3 bg-blue-900/60 border border-yellow-400 cursor-pointer hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => { addRage(5); alert(`Decree #${2024 + i} acknowledged. A fine of ₹500 has been deducted from your nonexistent Digital Wallet.`); }}
                >
                  <AlertTriangle size={14} className="mb-1 text-yellow-400" />
                  <p className="text-[9px] font-bold uppercase">{d}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suffering Map */}
          <div className="bg-white text-black border-4 border-double border-red-600 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-black italic uppercase">📍 Interactive Suffering Map</h3>
              <button
                className="gov-btn-secondary text-[9px] py-1"
                onClick={() => { addRage(8); alert("Map data loading... (est. 47 minutes)"); }}
              >
                <RefreshCw size={10} className="inline animate-spin mr-1" /> REFRESH
              </button>
            </div>
            <div className="h-48 bg-gray-200 border-2 border-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 animate-pulse"></div>
              <p className="absolute inset-0 flex items-center justify-center font-black text-xl text-red-600 rotate-6 z-10">
                DATA NOT FOUND<br />PLEASE RE-VERIFY AADHAAR
              </p>
              <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                <button className="bg-green-700 text-white text-[8px] p-1" onClick={() => { addRage(4); alert("Zoom unavailable. Please purchase the PREMIUM CITIZEN plan at ₹9,999/month."); }}>
                  ZOOM IN
                </button>
                <button className="bg-red-700 text-white text-[8px] p-1" onClick={() => { addRage(4); alert("You can't zoom out. You're already at maximum suffering."); }}>
                  ZOOM OUT
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ── POPUPS ── */}
      <AnimatePresence>
        {popups.map((p, i) => (
          <Popup
            key={i}
            title={p.title}
            onClose={() => removePopup(i)}
            initialX={60 + i * 80}
            initialY={100 + i * 70}
            tinyClose={p.tiny}
          >
            <p className="mb-3">{p.body}</p>
            <div className="flex gap-1">
              <button className="gov-btn text-[9px] py-1 px-2 flex-1" onClick={() => removePopup(i)}>OK</button>
              <button className="gov-btn-secondary text-[9px] py-1 px-2 flex-1" onClick={() => { addRage(8); alert("Cancel is not an option on a government portal."); }}>CANCEL</button>
            </div>
          </Popup>
        ))}
      </AnimatePresence>

      {/* ── LOGOUT TRAP MODALS ── */}
      <AnimatePresence>
        {logoutStage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4"
          >
            <div className="gov-card max-w-sm w-full text-center p-6 border-4 border-red-600 shadow-[20px_20px_0_red]">
              <div className="text-6xl mb-4 shake">🛑</div>
              {logoutStage === 1 && (
                <>
                  <h2 className="text-2xl font-black text-red-700 mb-2 uppercase">ATTENTION CITIZEN!</h2>
                  <p className="text-sm text-gray-700 mb-4 font-bold">
                    Attempting to leave the portal before completing your 47 mandatory forms is considered a sign of lack of patriotism.
                  </p>
                  <p className="text-xs text-red-600 mb-6 blink">Are you sure you want to proceed with this suspicious action?</p>
                </>
              )}
              {logoutStage === 2 && (
                <>
                  <h2 className="text-2xl font-black text-red-700 mb-2 uppercase">REALLY SURE?</h2>
                  <p className="text-sm text-gray-700 mb-4 font-bold">
                    By logging out, you agree to have your digital footprint audited by the Ministry of Internet Obedience.
                  </p>
                  <p className="text-xs text-red-600 mb-6 blink font-black">THIS ACTION WILL BE LOGGED PERMANENTLY.</p>
                </>
              )}
              {logoutStage === 3 && (
                <>
                  <h2 className="text-2xl font-black text-red-700 mb-2 uppercase">FINAL WARNING</h2>
                  <p className="text-sm text-gray-700 mb-4 font-bold">
                    If you leave now, you will lose your queue position (47,321) and your tax status will be set to "EXTRA SUSPICIOUS".
                  </p>
                  <p className="text-xs text-red-600 mb-6 font-black uppercase">Click 'I AM A COWARD' to confirm logout.</p>
                </>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={nextLogoutStage}
                  className="gov-btn w-full py-3 text-lg font-black bg-red-700"
                >
                  {logoutStage === 3 ? "I AM A COWARD (LOGOUT)" : "YES, I AM SUSPICIOUS"}
                </button>
                <button
                  onClick={() => { setLogoutStage(0); addRage(-5); }}
                  className="gov-btn-secondary w-full py-2 font-black"
                >
                  WAIT! I LOVE THE GOVERNMENT (STAY)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LOGOUT LOADER ── */}
      {showLogoutLoader && (
        <FakeLoader
          durationMs={6000}
          onComplete={() => router.push("/")}
          messages={[
            "Processing cowardice report...",
            "Updating tax status to 'EXTRA SUSPICIOUS'...",
            "Notifying local re-education center...",
            "Deleting your digital hope...",
            "Revoking your left-hand typing privileges...",
            "Almost logged out... please wait 3 more years...",
            "Just kidding. Bye. 😒",
          ]}
        />
      )}

      {/* ── CHATBOT ── */}
      <ChatBot />

      {/* ── FOOTER ── */}
      <footer className="bg-black text-[8px] text-center text-gray-500 py-2 border-t-2 border-yellow-400">
        © 1947–2026 MINISTRY OF SUFFERING | ALL RIGHTS REVERSED | NO REFUNDS | NO HOPE | NO CTRL+Z
      </footer>
    </div>
  );
}
