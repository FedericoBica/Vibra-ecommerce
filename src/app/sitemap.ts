import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vibralover.com';

  // 1. Productos reales de la DB
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true }
  });

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 2. Posts del blog que ya creaste
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

  // 3. Rutas principales que SÍ existen
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl, // Home
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/envios`, 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...productEntries, ...blogEntries];
}