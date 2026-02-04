'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteProduct = async (id: string) => {
  try {
    // 1. Podrías buscar las imágenes primero para borrarlas de Cloudinary si quisieras
    
    // 2. Borrar de la base de datos
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/admin/products');
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar el producto (puede que tenga órdenes asociadas)'
    };
  }
};