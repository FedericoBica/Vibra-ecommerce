// src/components/orders/SummaryCards.tsx
import { IoCubeOutline, IoCheckmarkCircleOutline, IoWalletOutline } from "react-icons/io5";

interface Props {
  summary: {
    totalOrders: number;
    pendingDelivery: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

export const SummaryCards = ({ summary }: Props) => {
  const { pendingDelivery, completedOrders, totalRevenue } = summary;

  const cards = [
    {
      title: "Pendientes Envío",
      value: pendingDelivery,
      icon: <IoCubeOutline className="text-pink-500" size={18} />,
      bg: pendingDelivery > 0 ? "bg-pink-500/10 border-pink-500/30" : "bg-zinc-900 border-zinc-800",
      textColor: "text-pink-500"
    },
    {
      title: "Entregados",
      value: completedOrders,
      icon: <IoCheckmarkCircleOutline className="text-green-500" size={18} />,
      bg: "bg-zinc-900 border-zinc-800",
      textColor: "text-zinc-200"
    },
    {
      title: "Recaudación",
      value: new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(totalRevenue),
      icon: <IoWalletOutline className="text-blue-400" size={18} />,
      bg: "bg-zinc-900 border-zinc-800",
      textColor: "text-zinc-200"
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${card.bg}`}
        >
          <div className="p-1.5 bg-zinc-950/50 rounded-md">
            {card.icon}
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 leading-none mb-1">
              {card.title}
            </p>
            <p className={`text-lg font-black leading-none ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};