"use client";

import { useState } from "react";
import { validateCoupon } from "@/actions";

export const CouponInput = ({ onApply }: { onApply: (discount: number, code: string) => void }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setFeedback(null);
    
    try {
      const resp = await validateCoupon(code.toUpperCase().trim());
      setLoading(false);

      if (resp.ok && resp.discount) {
        onApply(resp.discount, code.toUpperCase().trim());
        setFeedback({ msg: `¡Descuento del ${resp.discount}% aplicado!`, isError: false });
      } else {
        setFeedback({ msg: "Código no válido o expirado", isError: true });
        onApply(0, "");
      }
    } catch (error) {
      setLoading(false);
      setFeedback({ msg: "Error al validar", isError: true });
    }
  };

  return (
    <div className="mt-6 mb-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 mb-2 block">
        Cupón de Descuento
      </label>
      
      <div className="flex items-center gap-2 group">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="INTRODUCE TU CÓDIGO"
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-pink-500/50 focus:border-pink-500 transition-all uppercase placeholder:text-zinc-600"
          />
          {/* Icono decorativo sutil */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
            🎫
          </span>
        </div>

        <button 
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-black py-3 px-5 rounded-xl text-[10px] transition-all active:scale-95 whitespace-nowrap h-full border border-transparent shadow-lg"
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
          ) : (
            "APLICAR"
          )}
        </button>
      </div>
      
      {/* Feedback con altura fija para evitar saltos de layout */}
      <div className="h-6 mt-1 ml-1">
        {feedback && (
          <p className={`text-[10px] font-bold transition-all animate-in fade-in slide-in-from-top-1 ${
            feedback.isError ? "text-red-500" : "text-emerald-500"
          }`}>
            {feedback.isError ? "✕" : "✓"} {feedback.msg}
          </p>
        )}
      </div>
    </div>
  );
};