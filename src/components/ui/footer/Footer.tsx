import { titleFont } from '@/config/fonts';
import Link from 'next/link';
import { IoLogoInstagram } from 'react-icons/io5';

export const Footer = () => {
  return (
<footer className="flex w-full flex-col items-center justify-center border-t border-zinc-800 bg-black py-10 px-5 mt-20">
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 md:flex-row">
        {/* Redes Sociales */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Síguenos
          </span>
          <Link 
            href="https://instagram.com/vibralover_sexshop" // REEMPLAZA CON TU LINK REAL
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-full bg-zinc-900 p-3 transition-all hover:bg-pink-600/20"
          >
            <IoLogoInstagram 
              size={24} 
              className="text-zinc-400 transition-all group-hover:scale-110 group-hover:text-pink-500" 
            />
          </Link>
        </div>

        {/* Logo y Marca */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/">
            <span className="text-2xl font-black uppercase tracking-tighter italic text-white">
              VIBRA<span className="text-pink-600">LOVER</span>
            </span>
          </Link>
          <p className="mt-2 text-xs text-zinc-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
        </div>

        {/* CENTRO: Links rápidos (Opcional) */}
        {/* <div className="flex gap-6 text-sm font-medium text-zinc-400">
           <Link href="/gender/men" className="hover:text-pink-500 transition-colors">Hombres</Link>
           <Link href="/gender/women" className="hover:text-pink-500 transition-colors">Mujeres</Link>
           <Link href="/gender/unisex" className="hover:text-pink-500 transition-colors">Unisex</Link>
        </div> */}


      </div>

    </footer>)
}

