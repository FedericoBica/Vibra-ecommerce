'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Product } from '@prisma/client';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
  oldPrice: z.coerce.number().min(0).optional().nullable().transform(val => val ? Number(val.toFixed(2)) : null),
  inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
  sortOrder: z.coerce.number().int().default(0),
  categoryId: z.string().uuid(),
  color: z.coerce.string().transform(val => val.split(',').map(c => c.trim())),
  tags: z.string(),
  isPublished: z.preprocess((val) => val === 'true', z.boolean()),
  isPremiumUI: z.preprocess((val) => val === 'true', z.boolean()),
  premiumData: z.string().optional().nullable(),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const { id, premiumData, ...rest } = product;

  // --- 1. PROCESAR IMÁGENES PREMIUM INDIVIDUALES ---
  let parsedPremiumData: any = premiumData ? JSON.parse(premiumData) : null;

  // Procesar Pasos (1 al 3)
  const stepUrls: (string | null)[] = [];
  for (let i = 1; i <= 3; i++) {
    const file = formData.get(`file_step_${i}`) as File;
    if (file && file.size > 0) {
      const url = await uploadImages([file]);
      stepUrls.push(url ? url[0] : null);
    } else {
      // Si no hay archivo nuevo, mantenemos la que ya estaba en el JSON
      stepUrls.push(parsedPremiumData?.usage?.[i - 1]?.img || null);
    }
  }

  // Procesar Características (1 al 2)
  const featUrls: (string | null)[] = [];
  for (let i = 1; i <= 2; i++) {
    const file = formData.get(`file_feat_${i}`) as File;
    if (file && file.size > 0) {
      const url = await uploadImages([file]);
      featUrls.push(url ? url[0] : null);
    } else {
      featUrls.push(parsedPremiumData?.features?.[i - 1]?.img || null);
    }
  }

  // --- 2. ACTUALIZAR EL JSON CON LAS URLS ---
  if (parsedPremiumData) {
    if (parsedPremiumData.usage) {
      parsedPremiumData.usage = parsedPremiumData.usage.map((step: any, i: number) => ({
        ...step,
        img: stepUrls[i]
      }));
    }
    if (parsedPremiumData.features) {
      parsedPremiumData.features = parsedPremiumData.features.map((feat: any, i: number) => ({
        ...feat,
        img: featUrls[i]
      }));
    }
  }

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

      const productData = {
        ...rest,
        color: rest.color,
        tags: tagsArray,
        premiumData: parsedPremiumData, // Guardamos el JSON con las URLs inyectadas
      };

      if (id) {
        product = await tx.product.update({ where: { id }, data: productData });
      } else {
        product = await tx.product.create({ data: productData });
      }

      // --- 3. GALERÍA GENERAL ---
      const imagesFiles = formData.getAll('images') as File[];
      if (imagesFiles.length > 0 && imagesFiles[0].size > 0) {
        const images = await uploadImages(imagesFiles);
        if (!images) throw new Error('Error subiendo galería general');

        await tx.productImage.createMany({
          data: images.map(image => ({
            url: image!,
            productId: product.id,
          }))
        });
      }

      return { product };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };

  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error al procesar el producto' };
  }
};

// ... (uploadImages se mantiene igual)
const uploadImages = async( images: File[] ) => {
  try {
    const uploadPromises = images.map( async( image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return cloudinary.uploader.upload(`data:image/${image.type.split('/')[1]};base64,${ base64Image }`, {
          folder: 'vibra-lover-products'
        }).then( r => r.secure_url );        
      } catch (error) {
        console.log(error);
        return null;
      }
    })
    return await Promise.all( uploadPromises );
  } catch (error) {
    console.log(error);
    return null;
  }
}