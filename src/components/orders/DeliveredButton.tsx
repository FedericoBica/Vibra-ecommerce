"use client"; 
import { setOrderAsDelivered } from "@/actions/order/set-delivered";

interface Props {
  orderId: string;
  isDelivered: boolean;
}

export const DeliveredButton = ({ orderId, isDelivered }: Props) => {
  return (
    <button
      onClick={async () => {
        if (confirm("¿Confirmas que este pedido ya fue entregado?")) {
          await setOrderAsDelivered(orderId);
        }
      }}
      disabled={isDelivered}
      className={`ml-4 text-[10px] font-bold py-1 px-2 rounded transition-all ${
        isDelivered
          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          : "bg-pink-600/10 text-pink-500 hover:bg-pink-600 hover:text-white border border-pink-600/20"
      }`}
    >
      {isDelivered ? "Entregado" : "Marcar Entregado"}
    </button>
  );
};