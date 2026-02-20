'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createCoupon = async (code: string, discount: number) => {
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discount: discount,
        isActive: true
      }
    });
    revalidatePath('/admin/coupons');
    return { ok: true, coupon };
  } catch (error) {
    return { ok: false, message: 'El código ya existe o hubo un error.' };
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath('/admin/coupons');
    return { ok: true };
  } catch (error) {
    return { ok: false, message: 'No se pudo eliminar.' };
  }
};