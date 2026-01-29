import { Inter, Montserrat_Alternates } from 'next/font/google';




export const inter = Inter({ subsets: ['latin'] });


export const titleFont = Montserrat_Alternates({ 
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
  fallback: ['system-ui','arial']
});