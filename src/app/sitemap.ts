import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibralover.com';

  // 1. Productos
  const products = await prisma.product.findMany({
    select: { slug: true }
  });

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. NUEVO: Packs (Damos prioridad alta para SEO)
  const packs = await prisma.pack?.findMany({
    where: { isActive: true },
    select: { slug: true }
  }) || [];

  const packEntries: MetadataRoute.Sitemap = packs.map((pack) => ({
    url: `${baseUrl}/product/${pack.slug}`, // O la ruta que uses para packs
    changeFrequency: 'weekly',
    priority: 0.7, // Prioridad más alta para las ofertas
  }));

  // 3. Posts del blog
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true }
  });

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // 4. Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/envios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...staticRoutes, ...productEntries, ...packEntries, ...blogEntries];
}