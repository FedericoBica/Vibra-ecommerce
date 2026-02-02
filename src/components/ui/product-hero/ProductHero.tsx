import Image from 'next/image';

export const ProductHero = () => {
  return (
    <div className="relative h-[300px] sm:h-[450px] w-full overflow-hidden rounded-3xl mb-10">
      {/* Imagen de fondo con Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/imgs/hero-bg.jpg" // Asegúrate de tener una imagen aquí
          alt="Vibra Lover Hero"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Degradado para que el texto sea legible y se funda con el fondo negro */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      {/* Contenido del Hero */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-16">
        <span className="text-pink-500 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 animate-fade-in">
          Explora tus sentidos
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white max-w-2xl leading-tight">
          Tu placer, <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            nuestra prioridad.
          </span>
        </h1>
        <p className="mt-4 text-gray-300 text-sm sm:text-lg max-w-md font-light leading-relaxed">
          Descubre una selección exclusiva diseñada para elevar cada uno de tus momentos íntimos.
        </p>
      </div>
    </div>
  );
};