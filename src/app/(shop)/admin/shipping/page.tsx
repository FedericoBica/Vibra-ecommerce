import { getShippingConfig } from "@/actions/shipping/shipping-actions";
import { Title } from "@/components";
import { ShippingForm } from "./ui/ShippingForm";

export default async function ShippingPage() {
  const { methods = [], settings } = await getShippingConfig();

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-zinc-500 font-black uppercase italic animate-pulse">Cargando configuración logística...</p>
      </div>
    );
  }

  return (
    <div className="px-5 mb-20 max-w-7xl mx-auto">
      <Title 
        title="Shipping & Logistics" 
        subtitle="Administra las tarifas de envío y condiciones de bonificación global." 
      />
      
      <div className="mt-12 flex justify-center">
        <ShippingForm methods={methods} settings={settings} />
      </div>
    </div>
  );
}