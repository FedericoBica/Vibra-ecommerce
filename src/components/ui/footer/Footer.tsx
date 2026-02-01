import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10 text-gray-500 border-t border-zinc-900 pt-10">
      <Link href='/'>
        <span className={`${ titleFont.className } antialiased font-bold text-pink-500`}>Vibra </span>
        <span>| shop </span>
        <span>© { new Date().getFullYear() }</span>
      </Link>

      <Link href='/' className="mx-3 hover:text-pink-400 transition-colors">
        Privacidad & Legal
      </Link>

      <Link href='/' className="mx-3 hover:text-pink-400 transition-colors">
        Términos de uso
      </Link>
    </div>
  )
}