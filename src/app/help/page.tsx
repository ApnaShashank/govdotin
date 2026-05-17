"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Phone, MessageSquare, HelpCircle } from "lucide-react";
import ChatBot from "@/components/ChatBot";

const FAQS = [
  {
    q: "How do I reset my password?",
    a: "Please refer to Section 4B, Clause 12, Sub-clause (iii) of the User Manual. The manual is available at your nearest District Collectorate. Bring a photo ID, your original birth certificate, and an affidavit notarised by a Gazetted Officer.",
  },
  {
    q: "Why is my form showing 'ERROR: CITIZEN NOT FOUND'?",
    a: "This is normal. Our database runs on Windows XP and may occasionally forget you exist. Please wait 3–5 business decades and try again.",
  },
  {
    q: "My OTP never arrived. What do I do?",
    a: "OTPs are delivered via carrier pigeon. If your pigeon has not arrived, please check your local pigeon intake office. Average delivery time: 7–9 weeks.",
  },
  {
    q: "How do I upload documents?",
    a: "To upload documents, you must first convert them to .BMP format using Microsoft Paint (version 3.1 or earlier). Files must be between 50GB and 51GB in size. Use Form U-47 to request upload permission.",
  },
  {
    q: "Can I track my application status?",
    a: "Yes! Simply log in, navigate to Services > Applications > My Applications > Active > Pending > Unverified > click your application > wait > click refresh 47 times > give up.",
  },
  {
    q: "The website is not loading. What should I do?",
    a: "This is a feature. Our portal is optimized for 56k dial-up connections. Please ensure you are not connected to the internet, as this can interfere with the experience.",
  },
  {
    q: "My Aadhaar is linked to a buffalo. How do I fix this?",
    a: "The buffalo must appear in person at the Aadhaar centre with two valid photo IDs. The buffalo must be biometrically enrolled. Processing time: 18 months.",
  },
  {
    q: "Is there a mobile app?",
    a: "Yes. It's available on iPhone 3GS and above, and requires Android 1.5 or earlier. The app is rated 1.2 stars. We are proud of this.",
  },
];

const SEARCH_WRONG_RESULTS: Record<string, string> = {
  password: "Results for: PASTA RECIPES (4,721 results)",
  login:    "Results for: LION DANCE TUTORIAL (892 results)",
  form:     "Results for: FORMALDEHYDE SAFETY GUIDE (3 results)",
  aadhaar:  "Results for: AARDVARK CARE MANUAL (17 results)",
  help:     "Results for: HELP YOURSELF (0 results)",
  otp:      "Results for: OTP MEANING IN FANFICTION (15,442 results)",
};

export default function HelpPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [dialerOpen, setDialerOpen] = useState(false);
  const [dialerDigits, setDialerDigits] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "bot", text: "Welcome to HELP DESK. Your issue is very important to us. Please describe your problem in exactly 10 words, no more, no less." }
  ]);

  const handleSearch = () => {
    const key = Object.keys(SEARCH_WRONG_RESULTS).find(k => searchInput.toLowerCase().includes(k));
    if (key) {
      setSearchResult(SEARCH_WRONG_RESULTS[key]);
    } else {
      setSearchResult(`Results for: "${searchInput.toUpperCase()}" — 0 results found. Did you mean: "please give up"?`);
    }
  };

  const handleDial = (digit: string) => {
    setDialerDigits(p => p + digit);
  };

  const handleCall = () => {
    setTimeout(() => alert("All lines are busy. Estimated wait: 4.7 years. Your call is very important to us (it is not)."), 300);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    const userMsg = chatMsg.trim();
    setChatMsg("");
    setChatHistory(h => [...h, { from: "user", text: userMsg }]);
    setTimeout(() => {
      setChatHistory(h => [...h, {
        from: "bot",
        text: "Thank you for your message. This chat is for feedback only, not assistance. For assistance, please contact support. Support link is below. Support link is broken."
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Fake dialer modal */}
      <AnimatePresence>
        {dialerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <div className="bg-gray-300 border-4 border-gray-600 w-64 shadow-xl">
              <div className="window-bar bg-green-800">
                <span>📞 CALL SUPPORT</span>
                <button className="window-close" onClick={() => { setDialerOpen(false); setDialerDigits(""); }}>×</button>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-black text-green-400 font-mono p-2 text-right text-xl min-h-[2rem] border-2 border-gray-600">
                  {dialerDigits || " "}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {["1","2","3","4","5","6","7","8","9","*","0","#"].map(d => (
                    <button
                      key={d}
                      onClick={() => handleDial(d)}
                      className="gov-btn text-xl py-3 text-center"
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <button onClick={handleCall} className="w-full bg-green-700 text-white py-2 font-black border-2 border-green-900 flex items-center justify-center gap-2">
                  <Phone size={16} /> CALL
                </button>
                <p className="text-[8px] text-center text-gray-600">Helpline: 1800-SUFFER-NOW (not toll-free)</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#1a237e] text-white p-4 border-b-4 border-yellow-400 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2">
            <HelpCircle size={24} /> HELP & SUPPORT CENTRE
          </h1>
          <p className="text-[10px] text-blue-300">Where questions go to die since 1947</p>
        </div>
        <button onClick={() => router.push("/dashboard")} className="gov-btn-secondary text-xs py-1">
          ← BACK TO SUFFERING
        </button>
      </header>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">

        {/* Search bar */}
        <div className="gov-card">
          <h2 className="text-lg font-black mb-3 text-blue-900">🔍 SEARCH FOR HELP</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="gov-input flex-1"
              placeholder="Type your problem..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="gov-btn px-6" onClick={handleSearch}>
              SEARCH
            </button>
          </div>
          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-yellow-100 border-2 border-yellow-600 text-sm font-bold"
              >
                🔎 {searchResult}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-[9px] text-gray-400 mt-2 italic">Our search engine was last trained in 2003. Results may vary.</p>
        </div>

        {/* FAQ accordion */}
        <div className="gov-card">
          <h2 className="text-lg font-black mb-4 text-blue-900">📋 FREQUENTLY ASKED QUESTIONS</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-2 border-gray-300">
                <button
                  className="w-full text-left p-3 flex justify-between items-center bg-gray-50 hover:bg-blue-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-sm text-blue-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-white text-sm text-gray-700 border-t border-gray-300">
                        {faq.a}
                        <div className="mt-3 text-[9px] text-gray-400 italic">
                          Was this helpful? [YES] [NO] [I WANT TO SPEAK TO A MANAGER] [I HAVE GIVEN UP]
                          <br />
                          <button onClick={() => alert("Thank you for your feedback. It has been deleted.")} className="underline mr-2">YES</button>
                          <button onClick={() => alert("We are sorry to hear that. Please refer to the same answer again.")} className="underline mr-2">NO</button>
                          <button onClick={() => alert("The manager is also using this FAQ.")} className="underline">MANAGER</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Support options */}
        <div className="grid grid-cols-3 gap-4">
          {/* Phone */}
          <div className="gov-card text-center">
            <div className="text-4xl mb-3 float">📞</div>
            <h3 className="font-black text-blue-900 mb-1">CALL US</h3>
            <p className="text-[10px] text-gray-600 mb-3">1800-SUFFER-NOW<br />(Mon–Fri, 11am–11:15am)</p>
            <button className="gov-btn w-full text-sm" onClick={() => setDialerOpen(true)}>
              CALL NOW
            </button>
          </div>

          {/* Live chat */}
          <div className="gov-card text-center">
            <div className="text-4xl mb-3 wiggle">💬</div>
            <h3 className="font-black text-blue-900 mb-1">LIVE CHAT</h3>
            <p className="text-[10px] text-gray-600 mb-3">Average response time:<br />6–8 business decades</p>
            <button className="gov-btn w-full text-sm" onClick={() => setChatOpen(o => !o)}>
              CHAT (offline)
            </button>
          </div>

          {/* Email */}
          <div className="gov-card text-center">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="font-black text-blue-900 mb-1">EMAIL US</h3>
            <p className="text-[10px] text-gray-600 mb-3">support@gov.in.exe<br />(mailbox full since 2008)</p>
            <button
              className="gov-btn w-full text-sm"
              onClick={() => alert("Our email server has been full since 2008. Please send a physical letter to: Ministry of Digital Suffering, New Delhi - 110001. Allow 8 months for delivery.")}
            >
              SEND EMAIL
            </button>
          </div>
        </div>

        {/* Inline live chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="gov-card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-black text-blue-900">💬 LIVE CHAT (OFFLINE)</h3>
                  <button onClick={() => setChatOpen(false)} className="window-close" style={{ width: 24, height: 24, fontSize: 14 }}>×</button>
                </div>
                <div className="h-48 overflow-y-auto bg-gray-50 border-2 border-gray-300 p-3 space-y-2 mb-3">
                  {chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`px-3 py-1 text-xs max-w-[80%] border border-black ${m.from === "user" ? "bg-blue-600 text-white" : "bg-white text-black"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="gov-input flex-1 text-xs"
                    placeholder="Type your grievance..."
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendChat()}
                  />
                  <button onClick={sendChat} className="gov-btn text-xs px-4">SEND</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sitemap of broken links */}
        <div className="gov-card">
          <h2 className="text-lg font-black mb-3 text-blue-900">🗺️ USEFUL LINKS</h2>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            {[
              "User Manual (PDF, 4GB)", "Video Tutorial (404)", "Accessibility Guide",
              "Privacy Policy (classified)", "Cookie Policy (we don't use cookies but we do judge you)",
              "Grievance Portal (grievance about portal?)", "RTI Request Form", "Whistleblower Hotline (monitored)",
            ].map((link, i) => (
              <button
                key={i}
                className="text-blue-700 underline text-left hover:text-red-600 transition-colors"
                onClick={() => {
                  const msgs = [
                    "Page not found. It was never found.",
                    "This page requires a government-issued browser extension.",
                    "Access denied. Please upgrade to Citizen Premium.",
                    "Server error 418: I'm a teapot.",
                  ];
                  alert(msgs[i % msgs.length]);
                }}
              >
                → {link}
              </button>
            ))}
          </div>
        </div>

      </div>

      <ChatBot />

      <footer className="bg-[#1a237e] text-[8px] text-center text-blue-300 py-2">
        HELP & SUPPORT | NO HELP WILL BE PROVIDED | © MINISTRY OF SUFFERING
      </footer>
    </div>
  );
}
