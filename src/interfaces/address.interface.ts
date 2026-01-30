
export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  departamento: string;
  phone: string;
  // Nuevos campos
  email: string; 
  deliveryMethod: 'EXPRESS' | 'STANDARD' | 'PICKUP';
  lockerLocation?: string;
}