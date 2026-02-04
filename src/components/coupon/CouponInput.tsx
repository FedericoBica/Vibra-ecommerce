"use client";

import { useState } from "react";
import { validateCoupon } from "@/actions"; // Asegurate de importar la acción

export const CouponInput = ({ onApply }: { onApply: (discount: number, code: string) => void }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  const handleApply = async () => {
    if (!code) return;
    setLoading(true);
    
    const resp = await validateCoupon(code);
    setLoading(false);

    if (resp.ok && resp.discount) {
      onApply(resp.discount, code.toUpperCase().trim());
      setFeedback({ msg: "¡Cupón aplicado!", isError: false });
      // Limpiamos el mensaje después de 2 segundos
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ msg: "Código inválido", isError: true });
      onApply(0, "");
    }
  };

  return (
    <div className="mb-6 bg-zinc-800/20 p-4 rounded-xl border border-zinc-700/50">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CÓDIGO DE DESCUENTO"
          className="flex-1 bg-black/40 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-pink-500 uppercase"
        />
        <button 
          onClick={handleApply}
          disabled={loading}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? "..." : "APLICAR"}
        </button>
      </div>
      
      {/* Mensaje dinámico */}
      {feedback && (
        <p className={`text-[10px] mt-2 font-bold animate-pulse ${feedback.isError ? "text-red-400" : "text-emerald-400"}`}>
          {feedback.msg}
        </p>
      )}
    </div>
  );
};