import { Product } from '@/interfaces';
import { ProductGridItem } from './ProductGridItem';

interface Props {
  products: Product[];
}


export const ProductGrid = ( { products = [] }: Props ) => {
  if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-10 mb-10 px-4 sm:px-0">
      {
        products.map( product => (
          <ProductGridItem
            key={ product.slug }
            product={ product }
          />
        ) )
      }

    </div>
  );
};