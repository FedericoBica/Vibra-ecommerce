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
      <h3 className="font-bold mb-2">Colores disponibles</h3>

      <div className="flex flex-wrap gap-3">
        {availableColors.map((color) => (
          <button
            key={color}
            type="button" // Siempre es bueno especificar que es tipo button para evitar submits accidentales
            onClick={() => onColorChanged(color)}
            className="group relative flex flex-col items-center"
          >
            <div
              className={clsx(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                selectedColor === color 
                  ? "border-pink-500 scale-110 shadow-md" 
                  : "border-gray-200 hover:border-gray-400"
              )}
            >
              <span 
                className={clsx(
                  "w-7 h-7 rounded-full shadow-inner",
                  color === 'Blanco' && "border border-gray-100" // Un bordecito gris si el color es blanco
                )}
                style={{ backgroundColor: colorMap[color] || '#ccc' }}
              />
            </div>
            
            <span className={clsx(
              "text-[10px] mt-1 transition-colors",
              selectedColor === color ? "text-pink-600 font-bold" : "text-gray-500"
            )}>
              {color}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};