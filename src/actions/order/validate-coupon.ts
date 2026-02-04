'use server'

import prisma from "@/lib/prisma";

export const validateCoupon = async (code: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!coupon || !coupon.isActive) {
    return { ok: false, message: 'Cupón no válido' };
  }

  // Opcional: Validar fecha de expiración aquí
  
  return { ok: true, discount: coupon.discount };
}