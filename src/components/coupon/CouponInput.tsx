'use client'

import { validateCoupon } from "@/actions/order/validate-coupon";
import { useState } from "react";

export const CouponInput = ({ onApply }: { onApply: (discount: number, code: string) => void }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<{message: string, isError: boolean} | null>(null);

    const handleApply = async () => {
        setLoading(true);
        const resp = await validateCoupon(code);
        setLoading(false);

        if (resp.ok && resp.discount) {
            onApply(resp.discount, code.toUpperCase().trim());
            setStatus({ message: "¡Cupón aplicado con éxito!", isError: false });
            
            // Limpiamos el mensaje después de 2 segundos
            setTimeout(() => setStatus(null), 2000);
            setError(""); // Limpiamos error previo si existía
        } else {
            onApply(0, "");
            setError(resp.message || "Cupón no válido");
            setStatus(null);
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
        {status && !status.isError && (
        <p className="text-emerald-400 text-[10px] mt-2 font-bold animate-fade-in">
            {status.message}
        </p>
        )}
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