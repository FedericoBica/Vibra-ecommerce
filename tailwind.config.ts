import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Un negro casi púrpura para el fondo
        'sexshop-dark': '#0f0a12', 
        // Un rosa neón para botones y acentos
        'sexshop-pink': '#ff007a',
        // Un violeta eléctrico
        'sexshop-violet': '#8a2be2',
    }
    },
    animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Se mueve la mitad para un loop infinito fluido
        },
      },
  },
  plugins: [
      require('@tailwindcss/typography'),
      // ...
    ],
}
export default config
