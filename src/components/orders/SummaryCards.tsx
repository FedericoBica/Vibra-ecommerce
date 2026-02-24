// src/components/orders/SummaryCards.tsx
import { IoCashOutline, IoBagHandleOutline, IoTimeOutline, IoTrendingUpOutline } from "react-icons/io5";

interface Props {
  summary: {
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageTicket: number;
  }
}

export const SummaryCards = ({ summary }: Props) => {
  const cards = [
    {
      title: "Ventas",
      value: `$${summary.totalRevenue.toLocaleString()}`,
      icon: <IoCashOutline className="text-green-400" />,
    },
    {
      title: "Ticket Prom.",
      value: `$${summary.averageTicket.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <IoTrendingUpOutline className="text-pink-400" />,
    },
    {
      title: "Pendientes",
      value: summary.pendingOrders,
      icon: <IoTimeOutline className="text-yellow-400" />,
    },
    {
      title: "Éxito",
      value: summary.paidOrders,
      icon: <IoBagHandleOutline className="text-blue-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-3"
        >
          <div className="p-2 bg-zinc-900 rounded-lg text-lg hidden sm:block">
            {card.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter leading-none mb-1">
              {card.title}
            </p>
            <h3 className="text-base font-black text-white leading-none">
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};