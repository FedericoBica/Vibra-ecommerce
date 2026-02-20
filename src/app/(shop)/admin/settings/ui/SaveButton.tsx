'use client';

import { IoCheckmarkCircle, IoAlertCircle } from 'react-icons/io5';

interface Props {
  onClick?: () => void;
  saving: boolean;
  feedback: { ok: boolean; msg: string } | null;
  label?: string;
}

export const SaveButton = ({ onClick, saving, feedback, label = 'Guardar cambios' }: Props) => {
  return (
    <div className="flex items-center gap-4 pt-4">
      <button
        onClick={onClick}
        disabled={saving}
        className="flex-1 bg-pink-600 hover:bg-pink-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-3.5 rounded-xl uppercase tracking-[0.15em] text-sm transition-all active:scale-[0.98] shadow-lg shadow-pink-600/20"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Guardando...
          </span>
        ) : (
          label
        )}
      </button>

      {feedback && (
        <div 
          className={`flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-right-2 ${
            feedback.ok ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {feedback.ok ? (
            <IoCheckmarkCircle size={20} />
          ) : (
            <IoAlertCircle size={20} />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
};