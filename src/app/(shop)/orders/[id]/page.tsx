export const revalidate = 0;

import { redirect } from "next/navigation";
import Image from "next/image";

import { getOrderById } from "@/actions/order/get-order-by-id";
import { currencyFormat } from "@/utils";
import { OrderStatus, Title } from "@/components";
import { createMercadoPagoPreference } from "@/actions/payments/mercado-pago-preference";
import { MercadoPagoButton } from "@/components/mercadopago/MercadoPagoButton";
import { OrderTracker } from "@/components/orders/OrderTracker";


interface Props {
  params: {
    id: string;
  };
  // Declaramos searchParams para que Next.js acepte la basura de Mercado Pago sin quejarse
  searchParams: { [key: string]: string | string[] | undefined };
}

  export const lockerAddresses: Record<string, string> = {
  "Parking Euskadi": "Coronel Brandzen 2086 (Cordón)",
  "Disa Buceo": "Humberto 1ro. 3862 y Bv. José Batlle y Ordoñez",
  "Red Pagos RedRodó (Pque. Rodó)": "José Enrique Rodó 1801 esq. Gaboto",
  "Parking Catedral (Ciudad Vieja)": "Rincón 517 esq. Ituzaingo",
  "Mercado Williman": "Claudio Williman 626",
  "Ancap Brito del Pino": "Bartolito Mitre 2553 esq. Gral. Brito del Pino",
  "Ancap Servicentro Sayago": "Av. Gral. Eugenio Garzón 1028 esq. Cno. Ariel",
  "Ancap Barra de Carrasco": "Rambla Costanera s/n esq. Gral Lavalleja",
  "Disa Malvín": "Av. Italia 4763 esq. Valencia",
  "Galeria Paso Molino": "Av. Agraciada 4141",
  "Ancap Parque Posadas": "Av. Millán 3771 esq. Av. Joaquín Suarez",
  "Ancap Libertador (Centro)": "Av. Gral. Rondeau 1579",
  "MOM (Buceo)": "Luis Alberto de Herrera 1279 esq. Luis Lamas y Plácido Ellauri",
  "Farmacia Pigalle (Cordon)": "Av. 18 de Julio 2102 esq. Martin C. Martinez",
  "Farmacia Pigalle - 3 (Pocitos)": "Juan Benito Blanco 994 esq. José Martí",
  "UAM (Unidad Agroalimentaria)": "Camino Luis Eduardo Pérez 6651 (Nave Polivalente - Nave C)",
  "Parking Española (Tres Cruces)": "Palmar 2275 esq. Acevedo Díaz",
  "Parking Independencia(Ciudad Vieja)": "Florida 1440 esq. Mercedes",
  "Ancap Punto Clinicas": "Av. Italia 2905 esq. Dr. Jose Brito Foresti",
  "RedPagos - Del Parque (Parque Rodo)": "Bvr Artigas 1149 esq Maldonado",
  "Districad - Oficina Central": "Rafael Hortiguera 3830 esq. Av. Gral. San Martín",
  "Ancap Shangrilá": "Rambla Costanera s/n esq. Ecuador",
  "Ancap El Pinar": "Avda. Giannattasio Km. 28.500 esq. Av. Guillermo Perez Butler",
  "Ancap Las Piedras": "Av. Dr. Enrique Pouey 662 esq. Dr. Francisco Soca",
  "Punta Shopping": "Parada. 7 - Mansa esq. Av. Roosevelt",
};

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
              <div className="flex flex-col gap-1 mt-2 mb-3">
                <p className="text-blue-400 text-sm font-medium italic">
                  📧 {address?.email || order.guestEmail || 'Sin email registrado'}
                </p>
                {address?.dni && (
                  <p className="text-zinc-400 text-xs font-mono uppercase tracking-wider">
                    🆔 CI/DNI: <span className="text-zinc-200">{address.dni}</span>
                  </p>
                )}
              </div>
              
              <div className="h-px bg-zinc-700/50 my-3" />

              { order.deliveryMethod === 'PICKUP' ? (
                <div className="text-gray-300">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Retiro en Punto:</p>
                  <p className="text-pink-400 font-bold text-[17px] leading-tight">
                    📍 {order.lockerLocation ?? 'Locker seleccionado'}
                  </p>
                  
                  {/* DIRECCIÓN FÍSICA EN LETRA CHICA */}
                  {order.lockerLocation && lockerAddresses[order.lockerLocation] && (
                    <p className="text-[11px] text-gray-400 italic font-medium ml-6 mt-0.5">
                      {lockerAddresses[order.lockerLocation]}
                    </p>
                  )}

                  <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-[10px] text-gray-500 leading-tight">
                    <p>Recuerda que recibirás el <strong className="text-gray-300">código QR</strong> en tu email cuando el pedido esté listo.</p>
                  </div>
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

              {/* Si el descuento es mayor a 0, lo mostramos */}
              {order.discount > 0 && (
                <>
                  <span className="text-emerald-400 font-bold italic">Descuento aplicado</span>
                  <span className="text-right text-emerald-400 font-bold italic">
                    -{currencyFormat(order.discount)}
                  </span>
                </>
              )}
              
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
                <> 
                {/* El tracker invisible de Meta */}
                  <OrderTracker 
                    total={order.total} 
                    orderId={order.id} 
                    items={order.OrderItem} 
                  />
                
                <div className="bg-emerald-950/20 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl text-center font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <span className="block text-2xl mb-1">✨</span>
                  Pago confirmado. ¡Gracias por confiar en Vibra!
                </div>
                </>
              )}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}