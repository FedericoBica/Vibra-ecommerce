// app/(shop)/search/page.tsx
import { getProductsByTerm } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const term = searchParams.q || '';

  if (term.length === 0) redirect('/');

  const products = await getProductsByTerm(term);

  return (
    <div className="px-5 mb-10">
      <Title 
        title={products.length > 0 ? `Resultados para: "${term}"` : `No encontramos nada para: "${term}"`} 
        subtitle={products.length > 0 ? `${products.length} productos encontrados` : "Probá con otras palabras clave"}
      />

      {products.length > 0 && <ProductGrid products={products} />}
    </div>
  );
}