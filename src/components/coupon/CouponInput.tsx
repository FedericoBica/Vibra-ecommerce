'use client'

import { validateCoupon } from "@/actions/order/validate-coupon";
import { useState } from "react";

export const CouponInput = ({ onApply }: { onApply: (discount: number, code: string) => void }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (code.length < 3) return;
    
    setLoading(true);
    // Llamamos a la Server Action que consulta la DB
    const resp = await validateCoupon(code);
    setLoading(false);

    if (resp.ok && resp.discount) {
      onApply(resp.discount, code.toUpperCase().trim());
      setError("");
    } else {
      onApply(0, "");
      setError(resp.message || "Cupón no válido");
    }
  };

  return (
    <div className="mb-6 bg-zinc-800/20 p-4 rounded-xl border border-zinc-700/50">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
        ¿Tenés un cupon?
      </span>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CÓDIGO"
          className="flex-1 bg-black/40 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors uppercase"
        />
        <button 
          onClick={handleApply}
          disabled={loading}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? '...' : 'APLICAR'}
        </button>
      </div>
      {error && <p className="text-red-400 text-[10px] mt-2 italic">{error}</p>}
    </div>
  );
};