import prisma from "@/lib/prisma";

export const getPaginatedProductsAdmin = async ({
  page = 1,
  take = 12,
}) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 1,
          select: { url: true },
        },
        category: true,
      },
      // AQUÍ NO PONEMOS WHERE isPublished: true, queremos ver TODOS
    });

    const totalCount = await prisma.product.count(); // Cuenta total real de la DB

    return {
      currentPage: page,
      totalPages: Math.ceil(totalCount / take),
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error("No se pudo cargar los productos del admin");
  }
};