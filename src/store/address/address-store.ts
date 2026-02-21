import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: {
    firstName: string;
    lastName: string;
    email: string; // <--- Nuevo
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    departamento: string;
    phone: string;
    deliveryMethod: 'EXPRESS' | 'STANDARD' | 'PICKUP'; // <--- Nuevo
    lockerLocation?: string; 
    dni: string;
  };

  // Methods
  setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set, get) => ({
      address: {
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        departamento: "Montevideo",
        phone: "",
        deliveryMethod: 'STANDARD',
        lockerLocation: "",
        dni:'',
      },

      setAddress: (address) => {
        set({ address });
      },
    }),
    {
      name: "address-storage",
    }
  )
);