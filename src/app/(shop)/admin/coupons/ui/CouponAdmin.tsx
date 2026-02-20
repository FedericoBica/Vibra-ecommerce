'use client';

import { createCoupon, deleteCoupon } from "@/actions/coupons/admin-coupon";
import { useState } from "react";
import { IoTrashOutline, IoPricetagOutline } from "react-icons/io5";

interface Props {
  coupons: { id: string; code: string; discount: number; isActive: boolean }[];
}

export const CouponAdmin = ({ coupons }: Props) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* FORMULARIO DE CREACIÓN */}
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 h-fit">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <IoPricetagOutline className="text-pink-500" /> Nuevo Cupón
        </h3>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="CÓDIGO (EJ: VIBRA20)"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white uppercase outline-none focus:border-pink-500 transition-all"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="number"
            placeholder="% Descuento"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500 transition-all"
            value={discount || ""}
            onChange={(e) => setDiscount(+e.target.value)}
          />
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl transition-all disabled:bg-zinc-700"
          >
            {loading ? 'Creando...' : 'CREAR CUPÓN'}
          </button>
        </div>
      </div>

      {/* LISTADO DE CUPONES */}
      <div className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4 text-center">Descuento</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-pink-500/5 transition-colors group">
                <td className="px-6 py-4 font-black text-white">{coupon.code}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold">
                    {coupon.discount}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-[10px] text-zinc-500">Activo</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};