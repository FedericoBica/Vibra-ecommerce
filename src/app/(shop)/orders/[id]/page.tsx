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

  // Si no hay orden o hubo error
  if (!ok || !order) {
    redirect("/");
  }

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
                  // Blindamos la imagen por si el array viene vacío
                  src={
                    item.product.ProductImage && item.product.ProductImage.length > 0
                      ? `/products/${item.product.ProductImage[0].url}`
                      : '/imgs/placeholder.jpg'
                  }
                  width={100} 
                  height={100} 
                  alt={item.product.title}
                  className="mr-5 rounded object-cover"
                />
                <div>
                  <p className="font-semibold">{item.product.title}</p>
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
              
              { order.deliveryMethod === 'PICKUP' ? (
                <p className="mt-2 text-blue-800 font-medium">📍 {order.lockerLocation ?? 'Locker seleccionado'}</p>
              ) : (
                <div className="text-gray-700">
                  <p>{address?.address ?? 'Sin dirección registrada'}</p>
                  {address?.address2 && <p>{address.address2}</p>}
                  <p>{address?.city ?? ''}, {address?.departamento ?? ''}</p>
                  {address?.postalCode && <p>CP: {address.postalCode}</p>}
                </div>
              )}
              <p className="mt-2 text-sm font-semibold">Tel: {address?.phone ?? 'N/A'}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de pago</h2>
            <div className="grid grid-cols-2 text-gray-700">
              <span>Productos</span>
              <span className="text-right">{order.itemsInOrder}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order.subTotal)}</span>

              <span>Envío ({order.deliveryMethod})</span>
              <span className="text-right">{currencyFormat(order.shippingCost)}</span>

              <div className="col-span-2 mt-4 h-px bg-gray-200" />

              <span className="mt-5 text-2xl font-bold text-gray-900">Total:</span>
              <span className="mt-5 text-2xl text-right font-bold text-blue-600">
                {currencyFormat(order.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {!order.isPaid && preferenceId && (
                <MercadoPagoButton preferenceId={preferenceId} />
              )}
              {order.isPaid && (
                <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-lg text-center font-bold animate-pulse">
                  ✅ Pago confirmado. ¡Gracias por tu compra!
                </div>
              )}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}