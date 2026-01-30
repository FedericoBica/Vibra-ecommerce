import clsx from 'clsx';

interface Props {
  selectedColor?: string; // El color elegido (ej: 'Rosa')
  availableColors: string[]; // ['Rosa', 'Negro', 'Violeta']
  onColorSelected: (color: string) => void;
}

// Mapa opcional para mostrar el círculo con el color real
const colorMap: Record<string, string> = {
  'Rosa': '#FF69B4',
  'Negro': '#000000',
  'Violeta': '#8A2BE2',
  'Rojo': '#FF0000',
  'Azul': '#0000FF',
};

export const ColorSelector = ({ selectedColor, availableColors, onColorSelected }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Colores disponibles</h3>

      <div className="flex gap-3">
        {availableColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelected(color)}
            className={clsx(
              "group relative flex items-center justify-center rounded-full w-10 h-10 border-2 transition-all",
              selectedColor === color ? "border-blue-500 scale-110" : "border-transparent hover:border-gray-300"
            )}
            title={color}
          >
            {/* El círculo de color */}
            <span 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: colorMap[color] || '#ccc' }}
            />
            
            {/* Tooltip con el nombre al pasar el mouse */}
            <span className="absolute -top-8 scale-0 transition-all rounded bg-gray-800 p-1 text-xs text-white group-hover:scale-100">
              {color}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};