'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';
import { PackOption } from '@/interfaces';

const requireAdmin = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('No autorizado');
};

// ── Include reutilizable con imágenes correctas ───────────────────────────────
const packInclude = {
  products: {
    include: {
      product: {
        select: {
          id:     true,
          title:  true,
          price:  true,
          slug:   true,
          ProductImage: {        // ← nombre real de la relación en tu schema
            select: { url: true },
            take: 1,
          },
        }
      }
    }
  }
} as const;

// ── Tipo exportado para usar en componentes ───────────────────────────────────
export type PackWithProducts = Awaited<ReturnType<typeof getActivePacks>>[number];

// ── Leer todos los packs (admin) ──────────────────────────────────────────────
export const getAllPacks = async () => {
  try {
    const packs = await prisma.pack.findMany({
      include: packInclude,
      orderBy: { createdAt: 'desc' },
    });
    return { ok: true, packs };
  } catch {
    return { ok: false, packs: [] };
  }
};

// ── Leer packs activos (tienda) ───────────────────────────────────────────────
export const getActivePacks = async () => {
  try {
    const packs = await prisma.pack.findMany({
      where:   { isActive: true },
      include: packInclude,
      orderBy: { soldCount: 'desc' },
    });
    return packs;
  } catch {
    return [];
  }
};

// ── Packs que incluyen un producto específico ─────────────────────────────────
export const getPacksByProduct = async (productId: string) => {
  try {
    const packs = await prisma.pack.findMany({
      where:   { isActive: true, products: { some: { productId } } },
      include: packInclude,
    });
    return packs;
  } catch {
    return [];
  }
};

// ── Packs para sugerencia en el carrito ───────────────────────────────────────
export const getPacksForCart = async (productIds: string[]) => {
  try {
    const packs = await prisma.pack.findMany({
      where:   { isActive: true, products: { some: { productId: { in: productIds } } } },
      include: packInclude,
      take:    2,
    });
    return packs;
  } catch {
    return [];
  }
};

// ── Crear pack ────────────────────────────────────────────────────────────────
export const createPack = async (data: {
  title:        string;
  description:  string;
  price:        number;
  comparePrice?: number;
  productIds:   string[];
  options:      PackOption[];
}) => {
  try {
    await requireAdmin();

    if (data.productIds.length < 2)
      return { ok: false, message: 'Un pack requiere al menos 2 productos' };

    const slug = data.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing  = await prisma.pack.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const pack = await prisma.pack.create({
      data: {
        title:        data.title,
        description:  data.description,
        price:        data.price,
        comparePrice: data.comparePrice,
        slug:         finalSlug,
        isActive:     true,
        products: {
          create: data.productIds.map(productId => ({ productId }))
        }
      },
      include: packInclude,
    });
    // Actualizás options por separado con raw query
    await prisma.$executeRaw`
      UPDATE "Pack" SET options = ${JSON.stringify(data.options)}::jsonb WHERE id = ${pack.id}
    `;

    revalidatePath('/');
    revalidatePath('/admin/packs');
    return { ok: true, pack };
  } catch (e: any) {
    return { ok: false, message: e.message ?? 'Error al crear el pack' };
  }
};

export const updatePack = async (id: string, data: {
  price?: number;
  comparePrice?: number;
  title?: string;
  description?: string;
  isActive?: boolean;
}) => {
  try {
    await requireAdmin();
    await prisma.pack.update({ where: { id }, data });
    revalidatePath('/');
    revalidatePath('/admin/packs');
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al actualizar el pack' };
  }
};

// ── Toggle activo/inactivo ────────────────────────────────────────────────────
export const togglePack = async (id: string, isActive: boolean) => {
  try {
    await requireAdmin();
    await prisma.pack.update({ where: { id }, data: { isActive } });
    revalidatePath('/');
    revalidatePath('/admin/packs');
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al actualizar el pack' };
  }
};

// ── Eliminar pack ─────────────────────────────────────────────────────────────
export const deletePack = async (id: string) => {
  try {
    await requireAdmin();
    await prisma.pack.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/packs');
    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al eliminar el pack' };
  }
};

// ── Incrementar vendidos ──────────────────────────────────────────────────────
export const incrementPackSoldCount = async (packId: string) => {
  try {
    await prisma.pack.update({
      where: { id: packId },
      data:  { soldCount: { increment: 1 } }
    });
  } catch { /* silencioso */ }
};