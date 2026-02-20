import { getAllStoreConfig } from '@/actions/config/store-config';
import { SettingsTabs } from './ui/SettingsTabs';
import { ShippingSettingsForm } from './ui/ShippingSettingForm';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { CouponSettings } from './ui/CouponSettings';
import { TopBarSettingsForm } from './ui/TopBarSettings';
import { PromoModalSettingsForm } from './ui/PromoModalSettings';

// Forzamos a que no se guarde en cache para ver cambios en tiempo real
export const revalidate = 0;

export default async function SettingsPage() {
  
  // 1. Verificación de seguridad (Solo Admin)
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  // 2. Traemos TODA la configuración de la base de datos
  const [config, coupons] = await Promise.all([
    getAllStoreConfig(),
    prisma.coupon.findMany({ orderBy: { code: 'asc' } })
  ]);

  // Si no existe la config de topbar, enviamos valores por defecto
  const topbarConfig = {
    message1: (config.topbar as any)?.message1 || "🔥 Envíos GRATIS en compras mayores a $2.500",
    message2: (config.topbar as any)?.message2 || "🤫 Discreción absoluta en todos tus pedidos",
    };

  // 3. Definimos las secciones que verá el Admin
  // Por ahora tenemos Logística, pero aquí iremos agregando las demás
  const sections = [
    {
      id: 'shipping',
      label: 'Logística',
      icon: '📦',
      desc: 'Configura precios de envío y umbrales de regalo',
      content: <ShippingSettingsForm initialConfig={config.shipping} />,
    },
    {
      id: 'coupons', 
      label: 'Cupones',
      icon: '🎫',
      desc: 'Administra códigos de descuento y promociones',
      content: <CouponSettings initialCoupons={coupons} />,
    },
    {
      id: 'promo',
      label: 'Promo Pop-up',
      icon: '🎁',
      desc: 'Configura el modal de bienvenida y ofertas',
      content: <PromoModalSettingsForm initialConfig={config.promoModal} availableCoupons={coupons} />,
    },
    {
      id: 'topbar',
      label: 'Anuncios',
      icon: '📣',
      desc: 'Barra superior y mensajes del ticker',
      content: <TopBarSettingsForm initialConfig={topbarConfig} />,
    },
    {
      id: 'home',
      label: 'Personalizar Home',
      icon: '🏠',
      desc: 'Textos y banners principales',
      content: (
        <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 italic">Próximamente: Textos del Hero</p>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-8 pb-24 max-w-6xl mx-auto mt-10">
      <div className="mb-10">
        <Title title="Panel de Control" subtitle="Gestiona los valores de Vibra Lover sin tocar código." />
      </div>

      <SettingsTabs sections={sections} />
      
      <p className="mt-10 text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em]">
        Vibra CMS v1.0 — Todos los cambios son auditados
      </p>
    </div>
  );
}