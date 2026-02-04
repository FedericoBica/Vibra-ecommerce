"use server";

import { Color } from "@/interfaces";
import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  category?: string; 
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  category,
}: PaginationOptions) => {
  
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            id: true,  // <--- ¡IMPORTANTE! Agregamos el ID para poder borrar
            url: true,
          },
        },
        category: true,
      },
      where: {
        isPublished: true,
        category: category ? {
          name: category.toLowerCase()
        } : undefined,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        isPublished:true,
        category: category ? {
          name: category.toLowerCase()
        } : undefined,
      },
    });
    
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        // Mapeamos las imágenes para el array de strings que usa la Home
        images: product.ProductImage.map((image) => image.url),
        // Mantenemos ProductImage para que el Admin tenga los IDs
        ProductImage: product.ProductImage, 
        category: product.category.name as any,
        color: product.color as Color[],
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo cargar los productos");
  }
};