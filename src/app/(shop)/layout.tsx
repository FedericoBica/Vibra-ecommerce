import { Footer, Sidebar, TopMenu } from '@/components';
import { PromoModal } from '@/components/product/ui/PromoCartel';
import { ScrollToTop } from '@/components/product/ui/ScrollToTop';

export default function ShopLayout( { children }: {
  children: React.ReactNode;
} ) {
  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 text-gray-100">

      <TopMenu />
      <Sidebar />

      <div className="flex-grow px-0 sm:px-10">
        { children }

      </div>

      <ScrollToTop />
      <PromoModal />

      <Footer />
    </main>
  );
}