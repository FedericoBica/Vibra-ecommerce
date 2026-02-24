export const revalidate = 0;

import { getPaginatedOrders } from "@/actions";
import { Pagination, Title } from "@/components";
import { OrderFilters } from "@/components/orders/OrderFilters"; // Importamos el nuevo componente
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  searchParams: {
    page?: string;
    status?: string;
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const status = searchParams.status;

  const { ok, orders = [], totalPages = 1 } = await getPaginatedOrders({ 
    page, 
    status 
  });

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <div className="px-5">
      <Title title="Gestión de Órdenes" />

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
                      <span className="flex items-center text-red-400 text-xs font-bold uppercase tracking-wider bg-red-400/10 px-2 py-1 rounded">
                        <IoCardOutline className="mr-1" /> Pendiente
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-sm px-6">
                  <Link href={`/orders/${order.id}`} className="text-pink-500 hover:text-pink-400 font-bold transition">
                    Ver detalle
                  </Link>
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