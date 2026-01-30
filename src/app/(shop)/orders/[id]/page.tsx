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
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;
  const { ok, order } = await getOrderById(id);

  // Si no hay orden o hubo error en getOrderById (que ahora permite invitados)
  if (!ok || !order) redirect("/");

  let preferenceId: string | null = null;
  
  if (!order.isPaid) {
    const response = await createMercadoPagoPreference(id, order.total);
    if (response.ok && response.preferenceId) {
      preferenceId = response.preferenceId;
    }
  }

  const address = order.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid} />

            {order.OrderItem.map((item) => (
              <div key={item.product.slug + "-" + item.color} className="flex mb-5">
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100} height={100} alt={item.product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product.title}</p>
                  <p>${item.price} x {item.quantity}</p>
                  <p className="font-bold">Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2 font-bold">Detalles de Entrega</h2>
            <div className="mb-10 p-4 bg-blue-50 rounded border border-blue-100">
            <p className="text-xl font-bold">
              {address?.firstName ?? 'Invitado'} {address?.lastName ?? ''}
            </p>              
              {/* Lógica de Locker vs Envío */}
              { order.deliveryMethod === 'PICKUP' ? (
                <p className="mt-2 text-blue-800 font-medium">📍 Retiro en: {order.lockerLocation}</p>
              ) : (
                <>
                  <p>{address!.address}</p>
                  <p>{address!.address2}</p>
                  <p>{address!.city}, {address!.departamento}</p>
                </>
              )}
              <p className="mt-2 text-sm">Tel: {address!.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de pago</h2>
            <div className="grid grid-cols-2">
              <span>Productos</span>
              <span className="text-right">{order.itemsInOrder}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order.subTotal)}</span>

              {/* Mostramos el costo de envío que guardamos en la DB */}
              <span>Envío ({order.deliveryMethod})</span>
              <span className="text-right">{currencyFormat(order.shippingCost)}</span>

              <div className="col-span-2 mt-4 h-px bg-gray-200" />

              <span className="mt-5 text-2xl font-bold">Total:</span>
              <span className="mt-5 text-2xl text-right font-bold text-blue-600">
                {currencyFormat(order.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {!order.isPaid && preferenceId && (
                <MercadoPagoButton preferenceId={preferenceId} />
              )}
              {order.isPaid && (
                <div className="bg-green-100 text-green-700 p-4 rounded text-center font-bold">
                  Orden Pagada con Éxito
                </div>
              )}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}