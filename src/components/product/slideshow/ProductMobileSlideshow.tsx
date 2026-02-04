'use client';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';



interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductMobileSlideshow = ( { images, title, className }: Props ) => {


  return (
    <div className={ className }>

      <Swiper
        style={{
          width: '100%',
          height: '500px'
        }}
        pagination
        autoplay={{
          delay: 2500
        }}
        modules={ [ FreeMode, Autoplay, Pagination ] }
        className="mySwiper2"
      >

      {
        images.map( (image, index) => (
          <SwiperSlide key={ `${image}-${index}` }> {/* Key más única */}
            <Image
              width={ 600 }
              height={ 500 }
              src={ image.startsWith('http') ? image : `/products/${ image }` }
              alt={ title }
              className="object-cover" // Cambiado de fill a cover
              priority={ index === 0 } // Carga la primera imagen con prioridad
            />
          </SwiperSlide>
        ))
      }      
      </Swiper>



    </div>
  );
};