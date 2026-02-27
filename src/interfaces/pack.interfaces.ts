export interface PackOption {
  label:   string;    // ej: "Lubricante"
  choices: string[];  // ej: ["Fresa", "Neutro", "Calor"]
}

// Lo que el cliente seleccionó — va al carrito
export interface PackOptionSelection {
  label:  string;  // "Lubricante"
  choice: string;  // "Fresa"
}