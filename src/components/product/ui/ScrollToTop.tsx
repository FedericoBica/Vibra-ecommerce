'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import clsx from 'clsx';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando se scrollea hacia abajo
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Función para subir al inicio suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        className={clsx(
          "p-3 rounded-full bg-pink-600 text-white shadow-lg transition-all duration-300 hover:bg-pink-700 hover:scale-110",
          {
            'opacity-100 translate-y-0': isVisible,
            'opacity-0 translate-y-10 pointer-events-none': !isVisible,
          }
        )}
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>
    </div>
  );
};