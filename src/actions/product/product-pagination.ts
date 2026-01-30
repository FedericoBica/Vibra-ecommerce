"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  category?: string; // Cambiado de gender (Gender) a category (string)
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  category,
}: PaginationOptions) => {
  
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
        category: true, // Incluimos la info de la categoría para tener el nombre
      },
      // Filtrado por categoría
      where: {
        category: category ? {
          name: category.toLowerCase() // Buscamos por el nombre de la categoría
        } : undefined,
      },
    });

    // 2. Obtener el total de productos para la paginación
    const totalCount = await prisma.product.count({
      where: {
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
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo cargar los productos");
  }
};