'use client';

import { createCoupon, deleteCoupon } from "@/actions/coupons/admin-coupon";
import { useState } from "react";
import { IoTrashOutline, IoPricetagOutline, IoAddOutline } from "react-icons/io5";

interface Props {
  initialCoupons: any[];
}

export const CouponSettings = ({ initialCoupons }: Props) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!code || discount <= 0) return;
    setLoading(true);
    await createCoupon(code, discount);
    setCode("");
    setDiscount(0);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Formulario de Creación Rápida */}
      <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/50">
        <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Crear nuevo código</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="CÓDIGO (EJ: VIBRA20)"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white uppercase focus:border-pink-500 outline-none transition-all"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="number"
            placeholder="% DESC"
            className="w-full sm:w-32 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500 outline-none transition-all"
            value={discount || ""}
            onChange={(e) => setDiscount(+e.target.value)}
          />
          <button
            onClick={onSave}
            disabled={loading || !code}
            className="bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800 text-white font-bold px-8 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IoAddOutline size={20} />}
            <span>CREAR</span>
          </button>
        </div>
      </div>

      {/* Listado de Cupones Activos */}
      <div className="bg-zinc-900/20 rounded-2xl border border-zinc-800/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase">Cupón</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase text-center">Descuento</th>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {initialCoupons.map((coupon) => (
              <tr key={coupon.id} className="group hover:bg-pink-500/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-gray-200">{coupon.code}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/20">
                    {coupon.discount}% OFF
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {initialCoupons.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-zinc-600 italic text-sm">
                  No hay cupones activos actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};