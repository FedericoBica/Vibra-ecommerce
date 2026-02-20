import { getStoreConfig } from '@/actions';
import { Footer, Sidebar, TopBar, TopMenu } from '@/components';
import { PromoModal } from '@/components/product/ui/PromoCartel';
import { ScrollToTop } from '@/components/product/ui/ScrollToTop';

export default async function ShopLayout( { children }: {
  children: React.ReactNode;
} ) {

const [shippingConfig, topbarConfig] = await Promise.all([
    getStoreConfig('shipping'),
    getStoreConfig('topbar')
  ]);

  // Necesitamos buscar el cupón que el admin seleccionó
const promoConfig = await getStoreConfig('promoModal');
const selectedCoupon = promoConfig.couponId 
    ? await prisma.coupon.findUnique({ where: { id: promoConfig.couponId } })
    : null;
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-gray-100">

      <TopBar 
      freeShippingThreshold={shippingConfig.freeShippingThreshold}
      dbMessages={topbarConfig}/>
      <TopMenu />
      <Sidebar />

      <div className="flex-grow px-0 sm:px-1
      ">
        { children }

      </div>

      <ScrollToTop />
      <PromoModal config={promoConfig} couponCode={selectedCoupon?.code || 'PROMO'}/> 
      <Footer />
    </main>
  );
}