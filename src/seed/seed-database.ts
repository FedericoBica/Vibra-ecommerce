import prisma from '../lib/prisma';
import { initialData } from './seed';

async function main() {

  // 1. Borrar registros previos (Ojo con el orden por las relaciones)
  await prisma.orderItem.deleteMany();
  await prisma.orderAddress.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Eliminamos prisma.country.deleteMany() porque ya no existe la tabla Country

  const { categories, products, users } = initialData;

  // 2. Usuarios
  await prisma.user.createMany({
    data: users
  });

  // 3. Categorías
  const categoriesData = categories.map((name) => ({ name }));
  
  await prisma.category.createMany({
    data: categoriesData
  });

  // Obtenemos las categorías de la DB para tener los IDs
  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);


// 4. Productos
  // Usamos un for...of en lugar de forEach para manejar mejor el async/await
  for (const product of products) {
    const { category, images, colors, ...rest } = product;

    // Buscamos la categoría ignorando mayúsculas/minúsculas
    const dbCategory = categoriesDB.find(
      (c) => c.name.toLowerCase() === category.toLowerCase()
    );

    if ( !dbCategory ) {
      console.error(`Error: La categoría "${category}" no existe en la base de datos.`);
      continue; // Salta este producto si no hay categoría
    }

    // Insertamos el producto
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        oldPrice: (product as any).oldPrice ?? null,
        sortOrder: (product as any).sortOrder ?? 0,
        color: colors, 
        categoryId: dbCategory.id 
      }
    });

    // Imágenes
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  }
  console.log('Seed ejecutado con éxito');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;
  main();
})();