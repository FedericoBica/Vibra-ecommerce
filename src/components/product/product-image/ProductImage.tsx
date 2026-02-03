import Image from 'next/image';

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width: number;
  height: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ProductImage = ({ src, alt, className, style, width, height, onMouseEnter, onMouseLeave }: Props) => {

  // Forzamos el placeholder si no hay src o si es un string vacío
  let localSrc: string;

  if ( !src ) {
    localSrc = '/imgs/placeholder.jpg';
  } else if ( src.startsWith('http') ) {
    localSrc = src;
  } else {
    // Solo si estás SEGURO que tenés imágenes en public/products/
    localSrc = `/products/${ src }`;
  }

  return (
    <Image
      src={ localSrc }
      width={ width }
      height={ height }
      alt={ alt }
      className={ className }
      style={ style }
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
      // Si la URL de Cloudinary falla (da 404), mostramos el placeholder
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src.indexOf('placeholder.jpg') === -1) {
          target.src = '/imgs/placeholder.jpg';
        }
      }}
    />
  );
};