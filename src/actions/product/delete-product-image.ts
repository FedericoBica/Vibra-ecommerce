'use server';

import prisma from '@/lib/prisma';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );


export const deleteProductImage = async( imageId: number, imageUrl: string ) => {

  if ( !imageUrl.startsWith('http') ) {
    return {
      ok: false,
      error: 'No se pueden borrar imagenes de FS'
    }
  }

const imageName = imageUrl
    .split('/')
    .slice(-2) // Toma los últimos dos pedazos (carpeta y archivo)
    .join('/') // Los une con una barra
    .split('.')[0] ?? ''; // Quita el .jpg o .png

  try {

    await cloudinary.uploader.destroy( imageName );

    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })



    // Revalidar los paths
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/product/${ deletedImage.product.slug }`);
    revalidatePath(`/product/${ deletedImage.product.slug }`);

    return {ok:true}

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la imagen'
    }
  }




}
