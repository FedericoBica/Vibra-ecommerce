import prisma from "@/lib/prisma";
import { Title } from "@/components";
import { CouponAdmin } from "./ui/CouponAdmin";

export default async function CouponsPage() {
  
  const coupons = await prisma.coupon.findMany({
    orderBy: { code: 'asc' }
  });

  return (
    <div className="px-10">
      <Title title="Gestión de Cupones" subtitle="Crea y elimina códigos de descuento" />
      <CouponAdmin coupons={coupons} />
    </div>
  );
}