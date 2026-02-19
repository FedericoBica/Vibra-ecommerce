"use server";

import prisma from "@/lib/prisma";

export const getProductsForRecommendations = async (excludedIds: string[], categories: string[]) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { notIn: excludedIds },
        inStock: { gt: 0 },
        isPublished: true,
        // Buscamos productos que pertenezcan a las categorías sugeridas
        category: {
          name: {
            in: categories,
            mode: 'insensitive' // Para que no importe si es "Vibradores" o "vibradores"
          }
        }
      },
      take: 8,
      include: { ProductImage: { take: 2 } }
    });

    // Mezclamos y devolvemos 4
    return products
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(p => ({
        ...p,
        images: p.ProductImage.map(i => i.url)
      }));
  } catch (error) {
    return [];
  }
};