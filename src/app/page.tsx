"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RunningButton from "@/components/RunningButton";
import FakeLoader from "@/components/FakeLoader";
import UnhingedAd from "@/components/UnhingedAd";
import { AnimatePresence, motion } from "framer-motion";

const WRONG_CHARS: Record<string, string> = {
  a: "ज", b: "ब", c: "च", d: "ड", e: "ए", f: "फ",
  g: "ग", h: "ह", i: "इ", j: "झ", k: "क", l: "ल",
  m: "म", n: "न", o: "ओ", p: "प", q: "क़", r: "र",
  s: "स", t: "त", u: "उ", v: "व", w: "व्", x: "क्ष",
  y: "य", z: "ज़",
};

const NEWS = [
  "🚨 BREAKING: Government announces mandatory happiness tax of 48% — pay per smile",
  "📢 Aadhaar now required to purchase oxygen — link by midnight or breathe at your own risk",
  "⚠️ New rule: All passwords must contain the sound of one hand clapping",
  "🔔 Session will expire in 30 seconds — it always does",
  "🏆 India ranked #1 in Form Filling — government celebrates with more forms",
  "📋 Notification: Your father's middle name is now mandatory on all 847 government portals",
  "🛑 Internet Explorer required for best experience — please downgrade your browser",
];

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [capsPopup, setCapsPopup] = useState(false);
  const [newsIdx, setNewsIdx] = useState(0);
  const [bgColor, setBgColor] = useState(0);
  const [wrongPassPopup, setWrongPassPopup] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [anticaptcha, setAnticaptcha] = useState(generateCaptcha());
  const [bgHue, setBgHue] = useState(300);

  // Rotate news ticker
  useEffect(() => {
    const t = setInterval(() => setNewsIdx(i => (i + 1) % NEWS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Pulsing background hue
  useEffect(() => {
    const t = setInterval(() => setBgHue(h => (h + 2) % 360), 80);
    return () => clearInterval(t);
  }, []);

  // Caps lock warning every 8s regardless
  useEffect(() => {
    const t = setInterval(() => setCapsPopup(true), 8000);
    return () => clearInterval(t);
  }, []);

  // Password "strength" — goes DOWN as you type
  useEffect(() => {
    const len = password.length;
    if (len === 0) { setStrengthLabel(""); return; }
    if (len < 3)  setStrengthLabel("💪 VERY STRONG");
    else if (len < 6)  setStrengthLabel("😐 OKAY");
    else if (len < 10) setStrengthLabel("⚠️ GETTING WEAKER");
    else if (len < 14) setStrengthLabel("🚨 DANGEROUSLY WEAK");
    else               setStrengthLabel("☠️ CATASTROPHICALLY INSECURE");
  }, [password]);

  // Intercept keyboard — show wrong chars visually (for Citizen ID field)
  const handleUserIdKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toLowerCase();
    if (key in WRONG_CHARS && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setUserId(prev => prev + WRONG_CHARS[key]);
    }
  };

  const handleLogin = () => {
    if (!password || captchaInput.toLowerCase() !== "yes") {
      setWrongPassPopup(true);
      return;
    }
    setShowLoader(true);
  };

  function generateCaptcha() {
    const opts = ["yes", "YES", "Yes", "yEs", "yeS"];
    return opts[Math.floor(Math.random() * opts.length)];
  }

  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: `hsl(${bgHue}, 100%, 55%)` }}
    >
      {/* Floating Unhinged Ads */}
      <UnhingedAd type="floating" onAction={(boost) => console.log("Boosted", boost)} />

      {showLoader && (
        <FakeLoader
          durationMs={7000}
          onComplete={() => router.push("/dashboard")}
          messages={[
            "Querying National Citizen Database...",
            "Cross-referencing with 1947 census...",
            "Checking if you have paid your TV licence...",
            "Analysing your aura for security clearance...",
            "ERROR: Aura scan failed — retrying...",
            "Verifying your mother's maiden name's horoscope...",
            "Almost done! (not really)",
            "Connection lost. Reconnecting...",
            "Found you. Deciding whether to let you in...",
            "Fine. Welcome. 😒",
          ]}
        />
      )}

      {/* Caps Lock Popup */}
      <AnimatePresence>
        {capsPopup && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[999] bg-yellow-400 border-b-4 border-red-600 p-3 flex justify-between items-center"
          >
            <span className="font-black text-black text-sm blink">
              ⚠️ WARNING: CAPS LOCK IS ON. YOUR SHOUT WILL BE TAXED.
            </span>
            <button onClick={() => setCapsPopup(false)} className="window-close" style={{ width: 20, height: 20, fontSize: 12 }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wrong pass popup */}
      <AnimatePresence>
        {wrongPassPopup && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-[998] bg-black/70 flex items-center justify-center"
            onClick={() => setWrongPassPopup(false)}
          >
            <div className="bg-white border-8 border-double border-red-700 max-w-sm w-full mx-4 shadow-[20px_20px_0_black]" onClick={e => e.stopPropagation()}>
              <div className="window-bar bg-red-700">
                <span>CRITICAL AUTHENTICATION FAILURE</span>
                <button className="window-close" onClick={() => setWrongPassPopup(false)}>×</button>
              </div>
              <div className="p-6 text-center space-y-4">
                <div className="text-6xl">🚨</div>
                <p className="font-black text-xl text-red-700">LOGIN DENIED</p>
                <p className="text-sm text-gray-700">
                  Your credentials have been forwarded to the Cyber-Patriot Task Force.
                  A constable has been dispatched to your IP address.<br /><br />
                  <span className="font-bold">Tip:</span> Type <code className="bg-gray-200 px-1">yes</code> in the captcha box.
                </p>
                <button onClick={() => setWrongPassPopup(false)} className="gov-btn w-full">
                  I UNDERSTAND AND I AM CRYING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <header className="bg-[#1a237e] border-b-4 border-yellow-400 px-6 py-3 flex items-center gap-4">
        <Image src="/assets/logo.png" alt="Govt Logo" width={60} height={60} className="object-contain" />
        <div>
          <h1 className="text-yellow-400 font-black text-lg leading-tight glitch" data-text="BHARAT SARKAR CITIZEN PORTAL">
            BHARAT SARKAR CITIZEN PORTAL
          </h1>
          <p className="text-blue-300 text-[10px] font-bold">Ministry of Digital Suffering | Government of India | Est. 1947</p>
        </div>
        <div className="ml-auto text-[10px] text-yellow-300 text-right font-mono space-y-1">
          <div className="blink">🔴 SERVER: STRUGGLING</div>
          <div suppressHydrationWarning>VISITORS TODAY: {(47321 + Math.floor(Math.random() * 100)).toLocaleString()}</div>
        </div>
      </header>

      {/* News Ticker */}
      <div className="ticker-wrap">
        <AnimatePresence mode="wait">
          <motion.div
            key={newsIdx}
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 12, ease: "linear" }}
            className="ticker-content"
          >
            {NEWS[newsIdx]} &nbsp;&nbsp;&nbsp; ⬡ &nbsp;&nbsp;&nbsp;
            {NEWS[(newsIdx + 1) % NEWS.length]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left: decorative chaos */}
        <div className="hidden lg:flex flex-col items-center justify-center w-72 bg-[#000080] gap-6 p-6">
          <Image src="/assets/logo.png" alt="Govt Logo" width={140} height={140} className="object-contain spin-slow border-4 border-yellow-400 p-2 bg-blue-900 shadow-md" />
          <div className="text-center text-yellow-400 font-black text-sm space-y-2">
            <p className="blink text-red-400">⚠ IMPORTANT NOTICE ⚠</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              This portal uses <span className="text-yellow-400">256-bit encryption</span> 
              and is secured by the <span className="text-yellow-400">National Firewall of Confusion™</span>.
            </p>
          </div>
          <div className="crt-screen w-full text-xs space-y-1">
            <p className="blink-fast">&gt; CONNECTING...</p>
            <p>&gt; PING: ∞ms</p>
            <p>&gt; LOSS: 98%</p>
            <p>&gt; STATUS: SUFFERING</p>
          </div>
          <div className="text-[10px] text-gray-500 text-center">
            Portal best viewed in <br />
            <span className="text-yellow-400">Internet Explorer 6.0</span><br />
            at 800×600 resolution
          </div>
        </div>

        {/* Center: login card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="gov-card w-full max-w-md">
            {/* Card header */}
            <div className="text-center border-b-4 border-double border-blue-900 pb-4 mb-6">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                Secure Citizen Login Portal v2.0.1-ALPHA (BETA)
              </p>
              <h2 className="text-2xl font-black text-blue-900 uppercase">Citizen Verification</h2>
              <p className="text-[10px] text-red-600 font-bold mt-1 blink">
                ⚠ Unauthorized access will result in revocation of citizenship, fingers, and Wi-Fi
              </p>
            </div>

            <div className="space-y-5">
              {/* Citizen ID - types wrong chars */}
              <div>
                <label className="block text-xs font-black mb-1 text-blue-900 uppercase">
                  Citizen ID <span className="text-red-600">*</span>
                  <span className="ml-2 text-[8px] text-gray-400 font-normal">(Aadhaar / PAN / Ration Card / Library Card / Milk Booth Token)</span>
                </label>
                <input
                  type="text"
                  className="gov-input"
                  placeholder="Type your ID (keyboard may malfunction)"
                  value={userId}
                  onKeyDown={handleUserIdKey}
                  onChange={() => {}} // controlled but key override drives it
                />
                <p className="text-[8px] text-orange-600 mt-1 italic">
                  Note: Keyboard may type in Devanagari. This is a security feature.
                </p>
              </div>

              {/* Password - strength goes down */}
              <div>
                <label className="block text-xs font-black mb-1 text-blue-900 uppercase">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  className="gov-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {strengthLabel && (
                  <div className={`mt-1 text-[10px] font-black ${
                    password.length < 3 ? "text-green-600" :
                    password.length < 6 ? "text-yellow-600" :
                    password.length < 10 ? "text-orange-600" : "text-red-600 blink"
                  }`}>
                    Security: {strengthLabel}
                  </div>
                )}
                <div className="mt-2 text-[9px] text-gray-600 space-y-0.5 border border-dashed border-gray-300 p-2">
                  <p className="font-bold text-red-700">Password Rules:</p>
                  <p>• Must contain ≥1 Sanskrit character (ॐ recommended)</p>
                  <p>• Must contain a prime number between 137–199</p>
                  <p>• Must contain your childhood pet's zodiac sign</p>
                  <p>• Cannot contain vowels, consonants, or silence</p>
                  <p>• Must be exactly 7.5 characters long</p>
                  <p>• Must rhyme with "Jai Hind"</p>
                </div>
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="block text-xs font-black mb-2 text-blue-900 uppercase">
                  Visual Verification <span className="text-red-600">*</span>
                </label>
                <div className="border-4 border-dashed border-gray-400 bg-gray-50 p-3">
                  <p className="text-[10px] font-bold mb-2">
                    Select all traffic lights showing a valid Form-16 filing status:
                  </p>
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="border-2 border-black cursor-pointer hover:border-red-600 active:opacity-70 transition-all overflow-hidden"
                        onClick={() => alert("Wrong selection. The answer is ALL of them. Except none of them.")}
                      >
                        <Image
                          src="/assets/captcha.png"
                          alt="captcha"
                          width={100}
                          height={100}
                          className="w-full h-auto"
                          style={{ filter: `hue-rotate(${i * 40}deg) blur(${i % 3 === 0 ? 1 : 0}px)` }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-500 mb-2">OR: Type "{anticaptcha}" below to confirm you are human</p>
                  <input
                    className="gov-input text-xs"
                    placeholder={`Type "${anticaptcha}" exactly`}
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <RunningButton
                  className="gov-btn text-xl px-12 py-4 w-full"
                  onClick={handleLogin}
                  maxEscapes={6}
                >
                  🔐 PROCEED TO LOGIN
                </RunningButton>

                <div className="flex gap-4 text-[9px]">
                  <button
                    className="underline text-blue-800 hover:text-red-600"
                    onClick={() => alert("Forgot Password? Visit your nearest District Collectorate with Form B-47-C (Triplicate), your birth horoscope, and a notarised letter from your MLA.")}
                  >
                    Forgot Password?
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    className="underline text-blue-800 hover:text-red-600"
                    onClick={() => router.push("/help")}
                  >
                    New Citizen Registration
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    className="underline text-blue-800 hover:text-red-600"
                    onClick={() => alert("Aadhaar login is currently under maintenance. It has been under maintenance since 2019.")}
                  >
                    Login with Aadhaar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-4 w-64 p-2 bg-gray-100 border-l-4 border-blue-900">
          <UnhingedAd type="sidebar" onAction={(boost) => console.log("Boosted", boost)} />

          <div className="bg-[#000080] text-green-400 p-3 font-mono text-[9px] space-y-1">
            <p className="text-yellow-400 font-black">SYSTEM STATUS:</p>
            <p>📡 Server: CONFUSED</p>
            <p>🗄️ DB: ON FIRE</p>
            <p>🔒 SSL: EXPIRED</p>
            <p>☁️ Cloud: RAINING</p>
            <p>🤖 AI: UNEMPLOYED</p>
          </div>

          <div className="bg-white border-2 border-gray-400 p-3 text-xs space-y-2">
            <p className="font-black text-blue-900">HELPLINE:</p>
            <p>📞 1800-SUFFER-1</p>
            <p className="text-[8px] text-gray-500">(Mon–Fri, 11am–11:15am except public holidays)</p>
            <button
              className="w-full gov-btn-secondary text-[10px] py-1"
              onClick={() => alert("All lines are busy. Your estimated wait time is 4.7 years.")}
            >
              CALL NOW (lol)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#000080] text-[9px] text-gray-400 p-2 flex justify-between items-center border-t-2 border-yellow-400">
        <span>© 1947–2026 Ministry of Digital Suffering. All rights reversed.</span>
        <span className="blink text-red-400">🔴 LIVE: 47,321 citizens suffering right now</span>
        <span>Best viewed in 800×600 | IE 6.0 | ActiveX required</span>
      </footer>

      {/* Sticky bottom notification */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-yellow-400 border-t-4 border-black py-1 px-4 flex items-center justify-between text-[10px] font-black text-black"
        onClick={() => alert("There are no notifications. This notification is itself a notification. You now have 175 notifications.")}
        style={{ cursor: "pointer" }}
      >
        <span className="blink">🔔 YOU HAVE 174 UNREAD NOTIFICATIONS — CLICK TO IGNORE ALL</span>
        <span className="underline">DISMISS ALL (won't work)</span>
      </div>
    </main>
  );
}
