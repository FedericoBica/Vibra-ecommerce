'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Section {
  id: string;
  label: string;
  icon: string;
  desc: string;
  badge?: string;
  content: React.ReactNode;
}

interface Props {
  sections: Section[];
}

export const SettingsTabs = ({ sections }: Props) => {
  const [activeTab, setActiveTab] = useState(sections[0].id);

  // Buscamos la sección que coincide con la pestaña activa
  const activeSection = sections.find((s) => s.id === activeTab)!;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Navegación Lateral */}
      <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:w-64 flex-shrink-0 pb-4 lg:pb-0">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={clsx(
              'relative flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all flex-shrink-0 min-w-[140px] lg:min-w-0',
              activeTab === s.id
                ? 'bg-gradient-to-r from-pink-600/20 to-transparent border border-pink-500/30 text-white shadow-lg shadow-pink-900/10'
                : 'border border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
            )}
          >
            {/* Indicador rosa lateral */}
            {activeTab === s.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-pink-500 rounded-full" />
            )}

            <span className="text-2xl">{s.icon}</span>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={clsx(
                  'text-xs font-black uppercase tracking-widest truncate',
                  activeTab === s.id ? 'text-pink-400' : 'text-zinc-400'
                )}>
                  {s.label}
                </p>
                {s.badge && (
                  <span className="text-[9px] bg-pink-600 text-white px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                    {s.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-600 mt-0.5 truncate hidden lg:block">
                {s.desc}
              </p>
            </div>
          </button>
        ))}
      </nav>

      {/* Área de Contenido del Formulario */}
      <div className="flex-1 bg-zinc-900/20 border border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Encabezado del área activa */}
        <div className="flex items-center gap-4 px-8 py-6 border-b border-zinc-800/60 bg-zinc-900/40">
          <span className="text-4xl animate-bounce-subtle">{activeSection.icon}</span>
          <div>
            <h2 className="font-black text-white uppercase tracking-tighter text-2xl italic">
              {activeSection.label}
            </h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-medium">
              {activeSection.desc}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div key={activeTab} className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeSection.content}
        </div>
      </div>
    </div>
  );
};