import Link from 'next/link';
import { IoCartOutline } from 'react-icons/io5';

export default function EmptyPage() {
  return (
<div className="flex justify-center items-center h-[60vh] px-4"> {/* h-[60vh] para que no sea gigante */}
  <div className="flex flex-col items-center text-center bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800 w-full max-w-md">
    <IoCartOutline size={80} className="text-pink-600 mb-5 opacity-50" />
    <h1 className="text-2xl font-bold text-gray-100">Tu carrito está vacío</h1>
    <p className="text-gray-400 mt-2 mb-8">Parece que aún no has elegido tu próximo placer.</p>
    
    <Link href="/" className="btn-primary w-full py-4 rounded-xl font-bold">
      Ir a la tienda
    </Link>
  </div>
</div>  );
}