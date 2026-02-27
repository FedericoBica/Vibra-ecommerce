export const revalidate = 60; // 60 segundos


import { redirect } from 'next/navigation';

import { getAllStoreConfig, getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { ProductHero } from '@/components/ui/product-hero/ProductHero';
import { PacksSection } from '@/components/packs/PackSection';



interface Props {
  searchParams: {
    page?: string; 
  }
}


export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });

  const { home } = await getAllStoreConfig();

  if ( products.length === 0 ) {
    redirect('/');
  }


  return (
    <>

      <ProductHero config={home}/>

      <Title
        title="Todos los productos"
        subtitle="Encuentra lo que te hace vibrar"
        className="mb-2"
      />

      <PacksSection />
      <ProductGrid 
        products={ products }
      />


      <Pagination totalPages={ totalPages } />
      
    </>
  );
}
