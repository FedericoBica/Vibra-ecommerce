'use client';

import { useState } from 'react';
import { updateStoreConfig, ShippingConfig } from '@/actions/config/store-config';
import { SaveButton } from './SaveButton';

const METHODS = [
  { key: 'STANDARD' as const, label: 'Estándar', emoji: '📦', desc: 'Correo (24-72 hs)' },
  { key: 'EXPRESS'  as const, label: 'Express',  emoji: '⚡', desc: 'Mismo día (MVD)' },
  { key: 'PICKUP'   as const, label: 'Locker',   emoji: '🔐', desc: 'Punto de retiro' },
];

export const ShippingSettingsForm = ({ initialConfig }: { initialConfig: ShippingConfig }) => {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const save = async () => {
    setSaving(true);
    const r = await updateStoreConfig('shipping', config);
    setSaving(false);
    setFeedback({ ok: r.ok, msg: r.ok ? '¡Guardado!' : r.message ?? 'Error' });
    
    // El mensaje desaparece después de 4 segundos
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Sección de Precios por Método */}
      <div>
        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.25em] mb-4">
          Costos de envío por método
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {METHODS.map(({ key, label, emoji, desc }) => (
            <div key={key} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start gap-2 mb-4">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-[10px] text-zinc-500">{desc}</p>
                </div>
              </div>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">$</span>
                <input
                  type="number"
                  min={0}
                  value={config.prices[key]}
                  onChange={e => setConfig(p => ({ 
                    ...p, 
                    prices: { ...p.prices, [key]: Number(e.target.value) } 
                  }))}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-pink-500 rounded-xl pl-7 pr-3 py-3 text-white text-xl font-black text-center outline-none transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Envío Gratis (Tu requerimiento principal) */}
      <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-emerald-400 mb-1">🎁 Umbral de envío gratis</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Las compras que superen este monto tendrán envío bonificado
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-mono font-bold text-xl">$</span>
            <input
              type="number"
              min={0}
              value={config.freeShippingThreshold}
              onChange={e => setConfig(p => ({ ...p, freeShippingThreshold: Number(e.target.value) }))}
              className="w-32 bg-zinc-950 border border-emerald-500/30 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-2xl font-black text-center outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <SaveButton 
        onClick={save} 
        saving={saving} 
        feedback={feedback} 
        label="Guardar configuración de logística" 
      />
    </div>
  );
};