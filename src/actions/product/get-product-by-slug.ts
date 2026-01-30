'use server';

import prisma from '@/lib/prisma';

export const getProductBySlug = async( slug: string ) => {

  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: {
          select: {
            url: true
          }
        },
        // IMPORTANTÍSIMO: Incluir la categoría para que no sea undefined
        category: {
          select: {
            name: true
          }
        }
      },
      where: {
        slug: slug,
      }
    })

    if ( !product ) return null;

    // Aquí "aplanamos" el objeto para que coincida con tu Interface de Frontend
    return {
      ...product,
      images: product.ProductImage.map( image => image.url ),
      // Transformamos el objeto { name: 'juguetes' } en el string 'juguetes'
      category: product.category.name,
      // Como en el schema definimos colors como String[], Prisma ya lo trae bien
      color: product.color, 
    };

    
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener producto por slug');
  }
}