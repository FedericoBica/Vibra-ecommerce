import clsx from 'clsx';
import type { Color } from '@/interfaces'; // Importamos el tipo que creaste

interface Props {
  selectedColor?: Color; // Cambiado de string a Color
  availableColors: Color[]; // Cambiado de string[] a Color[]
  onColorChanged: (color: Color) => void;
}

// Ahora el mapa es estricto: solo acepta llaves que estén en el tipo Color
const colorMap: Record<Color, string> = {
  'Rosa': '#FF69B4',
  'Negro': '#000000',
  'Violeta': '#8A2BE2',
  'Rojo': '#FF0000',
  'Azul': '#0000FF',
  'Gris': '#808080',
  'Blanco': '#FFFFFF',
};

export const ColorSelector = ({ selectedColor, availableColors = [], onColorChanged }: Props) => {
  
  // Protección extra: Si por algún motivo de la DB no vienen colores, no renderizamos nada
  if (availableColors.length === 0) return null;

  return (
<div className="my-5">
  <h3 className="font-bold mb-3 text-gray-300 text-sm uppercase tracking-widest">Colores</h3>

  <div className="flex flex-wrap gap-4">
    {availableColors.map((color) => (
      <button
        key={color}
        onClick={() => onColorChanged(color)}
        className="group relative flex flex-col items-center"
      >
        <div
          className={clsx(
            "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            selectedColor === color 
              ? "border-pink-500 scale-110 shadow-[0_0_15px_rgba(219,39,119,0.3)]" 
              : "border-zinc-700 hover:border-pink-500/50 bg-zinc-800"
          )}
        >
          <span 
            className="w-8 h-8 rounded-full shadow-inner"
            style={{ backgroundColor: colorMap[color] || '#ccc' }}
          />
        </div>
      </button>
    ))}
  </div>
</div>  );
};