export const revalidate = 0;

import { getPaginatedOrders } from "@/actions";
import { getOrdersSummary } from "@/actions/order/get-order-summary";
import { setOrderAsDelivered } from "@/actions/order/set-delivered";
import { Pagination, Title } from "@/components";
import { DeliveredButton } from "@/components/orders/DeliveredButton";
import { OrderFilters } from "@/components/orders/OrderFilters"; // Importamos el nuevo componente
import { recoveryEmail } from "@/components/orders/RecoveryEmail";
import { SummaryCards } from "@/components/orders/SummaryCards";
import { trackingEmail } from "@/components/orders/TrackingEmail";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  searchParams: {
    page?: string;
    status?: string;
    delivery?: string; // 'PICKUP', 'STANDARD', 'EXPRESS'
    delivered?: string; // 'si', 'no'
    search?: string;
    };
}

export default async function OrdersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const status = searchParams.status;

  const { summary } = await getOrdersSummary();

  const { ok, orders = [], totalPages = 1 } = await getPaginatedOrders({ 
    page, 
    status: searchParams.status,
    delivery: searchParams.delivery,
    delivered: searchParams.delivered,
    search: searchParams.search
  });

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <div className="px-5 max-w-7xl mx-auto">
      <Title title="Gestión de Órdenes" />

      {/* Tarjetas del KPI */}
      {summary && <SummaryCards summary={summary} />}

      {/* Filtros de Cliente */}
      <OrderFilters currentStatus={status} />

      <div className="mb-10 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <table className="min-w-full">
          <thead className="bg-zinc-900 border-b border-zinc-800">
            <tr>
              <th className="text-sm font-bold text-zinc-300 px-6 py-4 text-left">#ID</th>
              <th className="text-sm font-bold text-zinc-300 px-6 py-4 text-left">Fecha</th>
              <th className="text-sm font-bold text-zinc-300 px-6 py-4 text-left">Cliente</th>
              <th className="text-sm font-bold text-zinc-300 px-6 py-4 text-left">Estado</th>
              <th className="text-sm font-bold text-zinc-300 px-6 py-4 text-left">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {orders.map((order) => (
              <tr key={order.id} className="transition hover:bg-zinc-900/50">
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {order.id.split("-").at(-1)}
                </td>
                <td className="text-sm text-zinc-400 px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString("es-UY")}
                </td>
                <td className="text-sm text-zinc-300 px-6 py-4">
                  {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {order.isPaid ? (
                      <span className="flex items-center text-green-400 text-xs font-bold uppercase tracking-wider bg-green-400/10 px-2 py-1 rounded">
                        <IoCardOutline className="mr-1" /> Pagada
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1">
                      <span className="flex items-center text-red-400 text-xs font-bold uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded w-fit">
                        <IoCardOutline className="mr-1" /> Pendiente
                      </span>
                      
                      {/* BOTÓN DE RECUPERACIÓN POR EMAIL */}
                      <a 
                        href={recoveryEmail(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-500 hover:text-pink-400 transition underline flex items-center gap-1"
                      >
                        📧 Enviar recordatorio
                      </a>
                    </div>
                    )}
                  </div>
                </td>
               {/* OPCIONES */}
                <td className="text-sm font-bold text-zinc-300 px-6 py-4 text-left min-w-[220px]">
                  <div className="flex items-center gap-3">
                    {/* 1. Ver Detalle (Icono o Texto discreto) */}
                    <Link 
                      href={`/orders/${order.id}`} 
                      className="text-[11px] uppercase tracking-tighter font-bold text-zinc-500 hover:text-pink-500 transition border border-zinc-800 px-2 py-1 rounded"
                    >
                      Detalle
                    </Link>
                    
                    {/* 2. Botón Entregado (El componente que ya tenés) */}
                    <DeliveredButton 
                      orderId={order.id} 
                      isDelivered={order.isDelivered} 
                    />

                    {/* 3. Botón Tracking (Unificado visualmente) */}
                    {order.deliveryMethod === 'STANDARD' && order.isPaid && !order.isDelivered && (
                      <a 
                        href={trackingEmail(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase text-blue-400 hover:text-blue-300 transition border border-blue-500/20 px-2 py-1 rounded bg-blue-500/5 flex items-center gap-1"
                      >
                        <span>🚚</span> Tracking
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} />
    </div>
  );
}