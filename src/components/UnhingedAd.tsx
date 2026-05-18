"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface UnhingedAdProps {
  type: "floating" | "sidebar" | "banner";
  onAction?: (rageBoost: number) => void;
}

const AD_TEMPLATES = [
  {
    id: "iphone",
    image: "/assets/ad_iphone.png",
    alt: "iPhone 16 Pro Max for 9 Rupees",
    title: "🔥 LIMITED PATRIOTIC OFFER! 🔥",
    tagline: "Claim iPhone 16 Pro Max for only ₹9!",
    action: "LINK AADHAAR NOW",
    popup: "Thank you for linking your bank account details. Your iPhone will be dispatched in 847 working days (subject to solar flare delay)."
  },
  {
    id: "buffalo",
    image: "/assets/ad_buffalo.png",
    alt: "Aadhaar Buffalo Link",
    title: "🥛 MILK TAX RELIEF PROGRAM 🥛",
    tagline: "Link your buffalo's biometric hoofprint to Aadhaar!",
    action: "REGISTER CATTLE",
    popup: "Hoofprint match score: 2%. Re-register buffalo on Tuesday during solar eclipse."
  },
  {
    id: "forms",
    image: "/assets/ad_forms.png",
    alt: "Hot Single Forms",
    title: "❤️ CITIZEN MATRIMONY ❤️",
    tagline: "Hot Single Forms (Form 16-A, Form 420) are waiting to be filled in your area!",
    action: "START FILLING",
    popup: "Form 16-A has rejected your proposal. Reason: Insufficient monthly income."
  },
  {
    id: "passport",
    image: "/assets/ad_bribe.png",
    alt: "Passport Bribe ad",
    title: "🛂 PASSPORT DEPRESS BYPASS 🛂",
    tagline: "Skip the local police inspection via convenience fee!",
    action: "PAY CONVENIENCE FEE",
    popup: "Alert: Convenience fee too low. We have upgraded your status to 'EXTREMELY SUSPICIOUS'."
  }
];

export default function UnhingedAd({ type, onAction }: UnhingedAdProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [closeBtnPos, setCloseBtnPos] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [showTrapPopup, setShowTrapPopup] = useState(false);
  const [trapText, setTrapText] = useState("");
  const [floatPos, setFloatPos] = useState({ top: "20%", left: "70%" });
  
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Rotate ads every 10 seconds
  useEffect(() => {
    setAdIndex(Math.floor(Math.random() * AD_TEMPLATES.length));
    const t = setInterval(() => {
      setAdIndex(prev => (prev + 1) % AD_TEMPLATES.length);
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // Drift float positions
  useEffect(() => {
    if (type !== "floating") return;
    const drift = setInterval(() => {
      setFloatPos({
        top: `${Math.floor(Math.random() * 40 + 20)}%`,
        left: `${Math.floor(Math.random() * 50 + 40)}%`
      });
    }, 8000);
    return () => clearInterval(drift);
  }, [type]);

  const ad = AD_TEMPLATES[adIndex];

  // Make close button run away from the cursor
  const handleCloseHover = () => {
    if (escapeCount < 4) {
      const offsetX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 60 + 50);
      const offsetY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 60 + 50);
      setCloseBtnPos({ x: offsetX, y: offsetY });
      setEscapeCount(prev => prev + 1);
      onAction?.(2); // increase rage
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction?.(5);
    setTrapText("To close this advertisement, a mandatory ad-closure fee of ₹199 will be deducted from your Aadhaar Wallet. Please complete Form C-99 to dispute.");
    setShowTrapPopup(true);
  };

  const handleAdClick = () => {
    onAction?.(10);
    setTrapText(ad.popup);
    setShowTrapPopup(true);
  };

  if (!visible) return null;

  if (type === "floating") {
    return (
      <>
        <AnimatePresence>
          {visible && !showTrapPopup && (
            <motion.div
              style={{
                position: "fixed",
                top: floatPos.top,
                left: floatPos.left,
                zIndex: 9990,
                width: "280px",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="gov-card p-3 border-4 border-yellow-400 bg-white shadow-[10px_10px_0_rgba(0,0,0,1)] relative select-none"
            >
              {/* Escape Close Button */}
              <motion.button
                ref={closeBtnRef}
                onClick={handleCloseClick}
                onMouseEnter={handleCloseHover}
                animate={{ x: closeBtnPos.x, y: closeBtnPos.y }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute z-[9995] bg-red-600 text-white border-2 border-black rounded-none p-1 flex items-center justify-center cursor-pointer shadow-md"
                style={{ top: "-15px", right: "-15px", width: "28px", height: "28px" }}
              >
                <X size={16} />
              </motion.button>

              <div className="bg-yellow-400 text-black text-[9px] font-black text-center py-0.5 tracking-wider uppercase blink mb-1">
                ADVERTISEMENT
              </div>

              <div className="cursor-pointer border-2 border-black overflow-hidden relative" onClick={handleAdClick}>
                <Image
                  src={ad.image}
                  alt={ad.alt}
                  width={280}
                  height={140}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="mt-2 text-center text-black">
                <h4 className="text-[10px] font-black tracking-wide text-red-600 blink-fast uppercase">{ad.title}</h4>
                <p className="text-[9px] font-mono leading-tight font-bold my-1">{ad.tagline}</p>
                <button
                  onClick={handleAdClick}
                  className="w-full mt-1 bg-rainbow text-white text-[10px] font-black py-1 border-2 border-black cursor-pointer shadow-sm uppercase tracking-widest active:translate-y-0.5"
                >
                  {ad.action}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trap Popup */}
        <AnimatePresence>
          {showTrapPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 font-mono"
            >
              <div className="gov-card max-w-sm w-full text-center border-4 border-red-600 bg-white p-6 shadow-[12px_12px_0_red]">
                <AlertTriangle size={48} className="text-red-600 mx-auto shake mb-2" />
                <h3 className="text-lg font-black text-red-700 uppercase tracking-widest mb-2">SYSTEM WARNING</h3>
                <p className="text-xs text-gray-800 leading-relaxed font-bold mb-4">
                  {trapText}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowTrapPopup(false);
                      setEscapeCount(0);
                      setCloseBtnPos({ x: 0, y: 0 });
                      // Add random drift to move it away
                      setFloatPos({
                        top: `${Math.floor(Math.random() * 40 + 20)}%`,
                        left: `${Math.floor(Math.random() * 50 + 20)}%`
                      });
                    }}
                    className="gov-btn text-xs py-2 uppercase"
                  >
                    Agree & Proceed to Suffering
                  </button>
                  <button
                    onClick={() => {
                      onAction?.(10);
                      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
                    }}
                    className="gov-btn-secondary text-[9px] py-1.5 uppercase"
                  >
                    File Grievance (Opens YouTube)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Sidebar / Inline banner type
  return (
    <div className="w-full bg-white border-4 border-black p-2 font-mono text-black relative flex flex-col items-center">
      <div className="absolute top-0 right-0 bg-yellow-400 border-l border-b border-black text-[7px] px-1 font-black uppercase">
        AD
      </div>
      
      <div className="cursor-pointer border-2 border-black w-full overflow-hidden relative my-1" onClick={handleAdClick}>
        <Image
          src={ad.image}
          alt={ad.alt}
          width={type === "sidebar" ? 200 : 600}
          height={type === "sidebar" ? 100 : 150}
          className="w-full h-auto object-contain bg-gray-50"
        />
      </div>

      <div className="text-center w-full mt-1">
        <p className="text-[8px] font-black text-red-600 blink uppercase leading-none mb-0.5">{ad.title}</p>
        <p className="text-[8px] text-gray-700 font-bold leading-tight line-clamp-1 mb-1">{ad.tagline}</p>
        <button
          onClick={handleAdClick}
          className="w-full py-1 text-[8px] font-black bg-blue-700 text-yellow-400 border border-black cursor-pointer shadow-sm uppercase active:translate-y-0.5"
        >
          {ad.action}
        </button>
      </div>

      {/* Trap Popup for static ads */}
      <AnimatePresence>
        {showTrapPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4"
          >
            <div className="gov-card max-w-sm w-full text-center border-4 border-red-600 bg-white p-6 shadow-[12px_12px_0_red]">
              <AlertTriangle size={48} className="text-red-600 mx-auto shake mb-2" />
              <h3 className="text-lg font-black text-red-700 uppercase tracking-widest mb-2">SYSTEM WARNING</h3>
              <p className="text-xs text-gray-800 leading-relaxed font-bold mb-4">
                {trapText}
              </p>
              <button
                onClick={() => setShowTrapPopup(false)}
                className="gov-btn w-full text-xs py-2 uppercase"
              >
                Accept Diktat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
