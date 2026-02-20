'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';

// 1. Definimos los tipos de secciones que tendrá nuestra configuración
export type ConfigKey = 'shipping' | 'topbar' | 'home' | 'store' | 'productUI' | 'promoModal';

// 2. Interfaces para tener autocompletado y evitar errores
export interface ShippingConfig {
  prices: { EXPRESS: number; STANDARD: number; PICKUP: number };
  freeShippingThreshold: number;
}

export interface TopbarConfig {
  messages: string[];
  backgroundColor: string;
  isActive: boolean;
}

export interface HomeConfig {
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroTagline: string;
}

export interface StoreInfo {
  storeName: string;
  instagramHandle: string;
  whatsappNumber: string;
  metaDescription: string;
}

export interface ProductUIConfig {
  showRating: boolean;
  showBestSellerBadge: boolean;
  showDiscountBadge: boolean;
  showHighlights: boolean;
  showSteps: boolean;
  showFeatures: boolean;
  showRelatedProducts: boolean;
  showStockWarning: boolean;
  stockWarningThreshold: number;
}

export type AllConfig = {
  shipping: ShippingConfig;
  topbar: TopbarConfig;
  home: HomeConfig;
  store: StoreInfo;
  productUI: ProductUIConfig;
  promoModal: PromoModalConfig;
};

// 2. Creamos la interfaz específica
export interface PromoModalConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  couponId: string;
  footerText: string;
  storageKey: string;
}
// 3. VALORES POR DEFECTO (Lo que usará la web si la DB está vacía)
const CONFIG_DEFAULTS: AllConfig = {
  shipping: {
    prices: { EXPRESS: 260, STANDARD: 160, PICKUP: 60 },
    freeShippingThreshold: 2500, // Tus $2500 de envío gratis
  },
  topbar: {
    messages: [
      '🔥 Envíos GRATIS en compras mayores a $2.500',
      '🤫 Discreción absoluta en todos tus pedidos',
    ],
    backgroundColor: '#db2777', // El rosa de Vibra
    isActive: true,
  },
  home: {
    heroTitle: 'Tu placer,',
    heroTitleAccent: 'nuestra prioridad.',
    heroSubtitle: 'Descubre una selección diseñada para elevar cada uno de tus momentos íntimos.',
    heroTagline: 'Explora tus sentidos',
  },
  store: {
    storeName: 'Vibra Lover',
    instagramHandle: 'vibralover_sexshop',
    whatsappNumber: '',
    metaDescription: 'Sex Shop premium en Uruguay. Envíos discretos a todo el país.',
  },
  productUI: {
    showRating: true,
    showBestSellerBadge: true,
    showDiscountBadge: true,
    showHighlights: true,
    showSteps: true,
    showFeatures: true,
    showRelatedProducts: true,
    showStockWarning: true,
    stockWarningThreshold: 5,
  },
  promoModal: {
    isActive: false,
    title: '¡Regalo Especial!',
    subtitle: 'Suscribite o usá este código para obtener un descuento.',
    couponId: '',
    footerText: '*Válido por tiempo limitado.',
    storageKey: 'promo-v1'
  }
};

/**
 * Obtiene una sección específica de la configuración
 */
export const getStoreConfig = async <K extends ConfigKey>(key: K): Promise<AllConfig[K]> => {
  try {
    const row = await prisma.storeConfig.findUnique({ where: { key } });
    if (!row) return CONFIG_DEFAULTS[key];
    
    // Combinamos los defaults con lo que haya en la DB por si agregamos campos nuevos después
    return { ...CONFIG_DEFAULTS[key], ...(row.value as any) } as AllConfig[K];
  } catch (error) {
    console.error(`Error al obtener config ${key}:`, error);
    return CONFIG_DEFAULTS[key];
  }
};

/**
 * Obtiene TODA la configuración de una sola vez
 */
export const getAllStoreConfig = async (): Promise<AllConfig> => {
  try {
    const rows = await prisma.storeConfig.findMany();
    const map = rows.reduce((acc, r) => {
      acc[r.key as ConfigKey] = r.value;
      return acc;
    }, {} as Record<string, any>);

    return {
      shipping:  { ...CONFIG_DEFAULTS.shipping,  ...(map.shipping  ?? {}) },
      topbar:    { ...CONFIG_DEFAULTS.topbar,    ...(map.topbar    ?? {}) },
      home:      { ...CONFIG_DEFAULTS.home,      ...(map.home      ?? {}) },
      store:     { ...CONFIG_DEFAULTS.store,     ...(map.store     ?? {}) },
      productUI: { ...CONFIG_DEFAULTS.productUI, ...(map.productUI ?? {}) },
      promoModal: { ...CONFIG_DEFAULTS.promoModal,...(map.promoModal ?? {})},
    };
  } catch (error) {
    return CONFIG_DEFAULTS;
  }
};

/**
 * Actualiza una sección de la configuración (Solo Admin)
 */
export const updateStoreConfig = async (
  key: ConfigKey,
  value: Record<string, any>,
): Promise<{ ok: boolean; message?: string }> => {
  
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No tienes permisos para realizar esta acción' };
  }

  try {
    await prisma.storeConfig.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    });

    // Revalidamos las rutas clave para que los cambios se vean sin recargar
    revalidatePath('/');
    revalidatePath('/admin/settings');
    if (key === 'productUI') revalidatePath('/product/[slug]');
    
    return { ok: true };
  } catch (error) {
    console.error(`Error guardando config "${key}":`, error);
    return { ok: false, message: 'Error al guardar en la base de datos.' };
  }
};