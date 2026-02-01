import Image from 'next/image';
import Link from 'next/link';
import { titleFont } from '@/config/fonts';

export const PageNotFound = () => {
  return (
  // En PageNotFound.tsx
  <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center bg-zinc-950 text-gray-100">
    <div className="text-center px-5 mx-5">
      <h2 className={ `${ titleFont.className } antialiased text-9xl text-pink-600 drop-shadow-[0_0_15px_rgba(219,39,119,0.5)]` }>404</h2>
      <p className="font-semibold text-xl">¡Oops! Te has desviado del placer.</p>
      <p className="font-light mt-2 text-gray-400">
        <span>No encontramos lo que buscas, regresa al </span>
        <Link href='/' className="text-pink-500 hover:underline font-normal">inicio</Link>
      </p>
    </div>
      <div className="px-5 mx-5">
        <Image
          src="/imgs/starman_750x750.png"
          alt="Starman"
          className="p-5 sm:p-0"
          width={ 550 }
          height={ 550 }
        />
      </div>
    </div>
  );
};