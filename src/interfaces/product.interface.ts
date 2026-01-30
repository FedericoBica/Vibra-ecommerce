export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  // sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  //todo: type: Type;
  category: ProductCategory;
  colors: string[]
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  // size: Size;
  image: string;
  color: string;
}


export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}


export type ProductCategory = 'juguetes' | 'juegos' | 'lubricantes' | 'bdsm';
