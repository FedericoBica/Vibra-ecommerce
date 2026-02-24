// app/(shop)/category/[slug]/page.tsx

export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    slug: string; // Cambiamos gender por slug
  },
  searchParams: {
    page?: string; 
  }
}

export default async function CategoryByPage({ params, searchParams }: Props) {

  const { slug } = params;
  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  // IMPORTANTE: Tu Server Action debe estar preparado para recibir 'category' en vez de 'gender'
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page, 
    category: slug, // <--- Aquí pasamos el slug de la categoría
  });

  if ( products.length === 0 ) {
    redirect('/'); // O a una página de "no hay productos"
  }

  return (
    <>
      <Title
        title={`Artículos de ${ slug.toUpperCase() }`} // O busca el nombre real en la DB
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={ products } />

      <Pagination totalPages={ totalPages }  />
    </>
  );
}