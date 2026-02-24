"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const setOrderAsDelivered = async (orderId: string) => {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        isDelivered: true,
        deliveredAt: new Date() 
      }
    });

    revalidatePath("/admin/orders"); // Esto refresca la tabla automáticamente
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: "No se pudo actualizar el estado de entrega" };
  }
};