import { FaInstagram } from 'react-icons/fa'; // Si usas react-icons

interface Props {
  message?: string;
  className?: string;
}

export const InstagramContact = ({ 
  message = "Hacenos tu consulta", 
  className 
}: Props) => {
  return (
    <a 
      href="https://ig.me/m/vibralover_sexshop" // <--- CAMBIA TU_USUARIO ACÁ
      target="_blank" 
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center gap-3 
        bg-zinc-800/50 hover:bg-zinc-700/50 
        text-white border border-zinc-700 
        py-3 px-5 rounded-2xl transition-all duration-300
        group ${className}
      `}
    >
      <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
        <FaInstagram className="text-white text-xl" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Ayuda Directa</span>
        <span className="text-sm font-semibold">{message}</span>
      </div>
    </a>
  );
};