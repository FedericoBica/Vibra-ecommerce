export const revalidate = 0;

import { redirect } from "next/navigation";
import Image from "next/image";

import { getOrderById } from "@/actions/order/get-order-by-id";
import { currencyFormat } from "@/utils";
import { OrderStatus, Title } from "@/components";
import { createMercadoPagoPreference } from "@/actions/payments/mercado-pago-preference";
import { MercadoPagoButton } from "@/components/mercadopago/MercadoPagoButton";

interface Props {
  params: {
    id: string;
  };
  // Declaramos searchParams para que Next.js acepte la basura de Mercado Pago sin quejarse
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OrdersByIdPage({ params, searchParams }: Props) {
  
  // Limpiamos el ID por si MP lo devuelve con una barra al final o parámetros pegados
  const cleanId = params.id.split('?')[0].replace('/', '');
  
  const { ok, order } = await getOrderById(cleanId);

  // Si no hay orden o hubo error
  if (!ok || !order) {
    redirect("/");
  }

  // Si el pago se confirmó, podrías usar searchParams para mostrar un mensaje extra,
  // pero por ahora solo dejamos que existan para evitar errores de renderizado.
  const isPaymentRedirect = !!searchParams.status; 

  let preferenceId: string | null = null;
  
  if (!order.isPaid) {
    const response = await createMercadoPagoPreference(cleanId, order.total);
    if (response.ok && response.preferenceId) {
      preferenceId = response.preferenceId;
    }
  }

  const address = order.OrderAddress;

return (
    <div className="flex justify-center items-center mb-72 px-4 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${cleanId.split("-").at(-1)?.toUpperCase()}`} />

        {/* Alerta de procesamiento Mercado Pago */}
        {isPaymentRedirect && !order.isPaid && (
          <div className="bg-amber-950/20 border border-amber-500/50 text-amber-500 px-4 py-3 rounded-xl mb-6 animate-pulse text-sm">
            Estamos procesando tu pago. Si ya pagaste, puede demorar unos minutos en impactar.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          
          {/* Columna Izquierda: Productos */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid} />

            <div className="mt-8 space-y-6">
              {order.OrderItem.map((item) => (
                <div key={item.product.slug + "-" + item.color} className="flex items-center gap-4 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800">
                  <Image
                    src={
                      item.product.ProductImage && item.product.ProductImage.length > 0
                        ? `/products/${item.product.ProductImage[0].url}`
                        : '/imgs/placeholder.jpg'
                    }
                    width={80} 
                    height={80} 
                    alt={item.product.title}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-200">{item.product.title}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-tighter">Color: {item.color}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400">${item.price} x {item.quantity}</p>
                      <p className="font-bold text-pink-500">{currencyFormat(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Resumen y Pago */}
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 p-7 h-fit shadow-2xl">
            <h2 className="text-xl mb-4 font-bold text-gray-200 uppercase tracking-widest">Detalles de Entrega</h2>
            
            <div className="mb-8 p-5 bg-zinc-800/40 rounded-xl border border-zinc-700/30">
              <p className="text-xl font-bold text-pink-500">
                {address?.firstName ?? 'Invitado'} {address?.lastName ?? ''}
              </p>              
              
              <div className="h-px bg-zinc-700/50 my-3" />

              { order.deliveryMethod === 'PICKUP' ? (
                <div className="text-gray-300">
                  <p className="text-xs text-gray-500 uppercase font-bold">Retiro en Punto:</p>
                  <p className="text-pink-400 font-medium mt-1">📍 {order.lockerLocation ?? 'Locker seleccionado'}</p>
                </div>
              ) : (
                <div className="text-gray-400 text-sm space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dirección:</p>
                  <p className="text-gray-200">{address?.address ?? 'Sin dirección registrada'}</p>
                  {address?.address2 && <p className="italic">{address.address2}</p>}
                  <p>{address?.city ?? ''}, {address?.departamento ?? ''}</p>
                  {address?.postalCode && <p>CP: {address.postalCode}</p>}
                </div>
              )}
              <p className="mt-4 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <span className="opacity-50">📞</span> {address?.phone ?? 'N/A'}
              </p>
            </div>

            <h2 className="text-xl mb-4 font-bold text-gray-200 uppercase tracking-widest">Resumen de pago</h2>
            <div className="grid grid-cols-2 text-gray-400 gap-y-2 text-sm">
              <span>Productos</span>
              <span className="text-right font-medium text-gray-200">{order.itemsInOrder}</span>

              <span>Subtotal</span>
              <span className="text-right font-medium text-gray-200">{currencyFormat(order.subTotal)}</span>

              <span>Envío ({order.deliveryMethod})</span>
              <span className="text-right font-medium text-gray-200">{currencyFormat(order.shippingCost)}</span>

              <div className="col-span-2 mt-4 h-px bg-zinc-800" />

              <span className="mt-5 text-xl font-bold text-gray-100 uppercase">Total:</span>
              <span className="mt-5 text-2xl text-right font-black text-pink-500 drop-shadow-[0_0_10px_rgba(219,39,119,0.2)]">
                {currencyFormat(order.total)}
              </span>
            </div>

            <div className="mt-8 mb-2 w-full">
              {!order.isPaid && preferenceId && (
                <div className="animate-in fade-in zoom-in duration-300">
                   <MercadoPagoButton preferenceId={preferenceId} />
                </div>
              )}
              {order.isPaid && (
                <div className="bg-emerald-950/20 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl text-center font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <span className="block text-2xl mb-1">✨</span>
                  Pago confirmado. ¡Gracias por confiar en Vibra!
                </div>
              )}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}