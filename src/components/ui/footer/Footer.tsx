import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
<footer className="flex w-full justify-center text-xs mb-10 px-6 sm:px-10"> {/* px-6 es la clave */}
  <div className="w-full max-w-[1200px] flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-zinc-800 pt-8 text-gray-500">
      <Link href='/'>
        <span className={`${ titleFont.className } antialiased font-bold text-pink-500`}>Vibra </span>
        <span>| Lover </span>
        <span>© { new Date().getFullYear() }</span>
      </Link>
    <div className="flex gap-6">
      <Link href="/">Privacidad & Legal</Link>
      <Link href="/">Términos de uso</Link>
    </div>
  </div>
</footer>
)
}

