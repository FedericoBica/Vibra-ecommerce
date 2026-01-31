import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';

interface Props {
  params: {
    slug: string;
  }
}



export default async function ProductPage({ params }: Props) {

  const { slug } = params;

  const [ product, categories ] = await Promise.all([
    getProductBySlug(slug),
    getCategories()
  ]);
 

const title = (slug === 'new') ? 'Nuevo producto' : 'Editar producto';

      // Creamos un objeto que TypeScript acepte
      const productData = product ? {
        ...product,
        // Forzamos a que ignore la discrepancia de 'category' y 'color'
        category: product.category as any,
        color: product.color as any,
      } : {};
  return (
    <>
      <Title title={ title } />

      <ProductForm product={ productData as any } categories={ categories } />
    </>
  );
}