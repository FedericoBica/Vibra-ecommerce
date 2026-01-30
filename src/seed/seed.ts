import bcryptjs from 'bcryptjs';


interface SeedProduct {
  description: string;
  images: string[];
  inStock: number;
  price: number;
  colors: ValidColor[];
  slug: string;
  tags: string[];
  title: string;
  category: ValidCategory;
}

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin'|'user'
}

type ValidColor = 'Rosa' | 'Negro' | 'Violeta' | 'Rojo' | 'Azul' | 'Gris' | 'Blanco';
type ValidCategory = 'juguetes' | 'juegos' | 'lubricantes' | 'bdsm';

interface SeedData {
  users: SeedUser[];
  categories: string[];
  products: SeedProduct[];
}




export const initialData: SeedData = {

  users: [
    {
      email: 'fernando@google.com',
      name: 'Fernando Herrera',
      password: bcryptjs.hashSync('123456'),
      role: 'admin'
    },
    {
      email: 'melissa@google.com',
      name: 'Melissa Flores',
      password: bcryptjs.hashSync('123456'),
      role: 'user'
    },


  ],


  categories: [
    'juguetes', 
    'juegos', 
    'lubricantes', 
    'bdsm'
  ],
  products: [
    {
      title: "Vibrador Rabbit Premium",
      description: "Vibrador con estimulador de clítoris de silicona médica.",
      images: ['vibrador-app.webp','vibrador-app-2.webp'],
      inStock: 15,
      price: 1890,
      colors: ['Rosa', 'Violeta'], // <--- Solo acepta ValidColor
      slug: "vibrador-rabbit-premium",
      tags: ['vibrador', 'clitoris'],
      category: 'juguetes' // <--- Solo acepta ValidCategory
    },
    {
      title: "Lubricante de Frutilla",
      description: "Lubricante efecto calor sabor frutilla.",
      images: ['vibrador-doble-estimulo-negro.webp','vibrador-doble-estimulo-2'],
      inStock: 20,
      price: 550,
      colors: ['Rojo'],
      slug: "lubricante-frutilla",
      tags: ['lubricante', 'calor'],
      category: 'lubricantes'
    }
  ]
};