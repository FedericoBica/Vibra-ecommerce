export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  slug: string;
  tags: string[];
  title: string;
  category: ProductCategory;
  color: Color[]
  categoryId: string
  isPublished: boolean;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color: Color;
}


export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}

export type Color = 'Rosa' | 'Negro' | 'Violeta' | 'Rojo' | 'Azul' | 'Gris' | 'Blanco';
export type ProductCategory = 'juguetes' | 'juegos' | 'lubricantes' | 'bdsm';
