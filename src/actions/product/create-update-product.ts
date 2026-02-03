'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Product } from '@prisma/client';
import { z } from 'zod';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );



const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform( val => Number(val.toFixed(2)) ),
  inStock: z.coerce
    .number()
    .min(0)
    .transform( val => Number(val.toFixed(0)) ),
  categoryId: z.string().uuid(),
  color: z.coerce.string().transform( val => val.split(',').map(c => c.trim()) ), 
  tags: z.string(),
});





export const createUpdateProduct = async( formData: FormData ) => {

  const data = Object.fromEntries( formData );
  const productParsed = productSchema.safeParse( data );

  if ( !productParsed.success) {
    console.log( productParsed.error );
    return { ok: false }
  }

  const product = productParsed.data;
  product.slug = product.slug
    .toLowerCase()
    .trim()
    .normalize('NFD') // Divide caracteres como 'é' en 'e' + '´'
    .replace(/[\u0300-\u036f]/g, "") // Borra los acentos/tildes
    .replace(/[^a-z0-9 -]/g, "") // Quita cualquier cosa que no sea letra, número o espacio
    .replace(/\s+/g, '-') // Cambia espacios por guiones
    .replace(/-+/g, '-'); // Evita guiones dobles (--)

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction( async (tx) => {
  
      let product: Product;
      const tagsArray = rest.tags.split(',').map( tag => tag.trim().toLowerCase() );
  
      const productData = {
        ...rest,
        // En Prisma ahora usamos colors en lugar de sizes
        color: rest.color, 
        tags: tagsArray,
      };

      if ( id ) {
        // Actualizar
        product = await tx.product.update({
          where: { id },
          data: productData
        });
      } else {
        // Crear
        product = await tx.product.create({
          data: productData
        });
      }  
      
      // Proceso de carga y guardado de imagenes
      // Recorrer las imagenes y guardarlas
      if ( formData.getAll('images') ) {
        // [https://url.jpg, https://url.jpg]
        const images = await uploadImages(formData.getAll('images') as File[]);
        if ( !images ) {
          throw new Error('No se pudo cargar las imágenes, rollingback');
        }

        await tx.productImage.createMany({
          data: images.map( image => ({
            url: image!,
            productId: product.id,
          }))
        });

      }
  
  
  
      
      return {
        product
      }
    });


    // Todo: RevalidatePaths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${ product.slug }`);
    revalidatePath(`/products/${ product.slug }`);


    return {
      ok: true,
      product: prismaTx.product,
    }

    
  } catch (error) {
    
    return {
      ok: false,
      message: 'Revisar los logs, no se pudo actualizar/crear'
    }
  }

}



const uploadImages = async( images: File[] ) => {

  try {

    const uploadPromises = images.map( async( image) => {

      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
  
return cloudinary.uploader.upload(`data:image/${image.type.split('/')[1]};base64,${ base64Image }`, {
      folder: 'vibra-lover-products' // <--- Esto organiza tus fotos en Cloudinary
    }).then( r => r.secure_url ); // <--- El .then se queda para capturar la URL final        
      } catch (error) {
        console.log(error);
        return null;
      }
    })


    const uploadedImages = await Promise.all( uploadPromises );
    return uploadedImages;


  } catch (error) {

    console.log(error);
    return null;
    
  }


}
