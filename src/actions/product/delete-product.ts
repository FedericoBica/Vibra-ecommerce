'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteProduct = async (id: string) => {
  try {
    // 1. Borramos primero las imágenes relacionadas
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // 2. Ahora que el producto no tiene "hijos", lo podemos borrar
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar el producto. Verifique si tiene órdenes asociadas.'
    };
  }
};