import { Title } from "@/components";
import { InstagramContact } from "@/components/product/ui/InstagramContact";

export default function EnviosPage() {
  return (
    <div className="px-5 mb-20 max-w-3xl mx-auto min-h-screen">
      <Title 
        title="Envíos y Entregas" 
        subtitle="Recibí tu pedido de forma rápida, discreta y segura en todo Uruguay." 
      />

      <div className="mt-10 space-y-12 text-zinc-300">
        
        {/* Empaque Discreto */}
        <section className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-blue-500">🤫</span> Empaque 100% Discreto
          </h2>
          <p className="leading-relaxed">
            Tu privacidad es nuestra prioridad. Todos los pedidos se envían en cajas o sobres 
            <span className="font-semibold text-white"> sin logos, marcas ni referencias </span> 
            al contenido o a la tienda.
          </p>
        </section>

        {/* Lockers */}
        <section className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple-500">🔐</span> Entrega en Lockers (Redelocker)
          </h2>

          <div className="space-y-4">
            <p>
              Antes de finalizar tu compra, podés elegir el locker Redelocker que te quede más cómodo.
            </p>

            <ul className="space-y-2 text-zinc-400">
              <li>• Elegís el locker al hacer tu pedido</li>
              <li>• Nosotros realizamos la reserva y te enviaremos el codigo para su apertura</li>
              <li>• En aproximadamente 24hs tu pedido estará disponible</li>
              <li>• Tenés hasta 4 dias para retirarlo con total tranquilidad</li>
            </ul>

            <p className="text-sm text-zinc-500 mt-4">
              Ideal si querés máxima discreción y flexibilidad horaria.
            </p>
          </div>
        </section>

        {/* Envíos por zona */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30">
            <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">
              Montevideo
            </h3>
            <p className="text-zinc-400">
              Envíos rápidos y opción de lockers. 
              Coordinamos la entrega en hasta 24-72 hs hábiles según modalidad.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/30">
            <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">
              Interior del país
            </h3>
            <p className="text-zinc-400">
              Realizamos envíos a todos los departamentos mediante agencia. 
              Despachamos en menos de 24 hs hábiles.
            </p>
          </div>

        </section>

        {/* CTA final */}
        <section className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 rounded-3xl border border-zinc-800 text-center">
          <h3 className="text-white text-xl font-semibold mb-3">
            ¿Tenés dudas sobre tu envío?
          </h3>
          <p className="text-zinc-400 mb-4">
            Escribinos y te ayudamos a elegir la mejor opción para vos.
          </p>
          <p className="text-sm text-zinc-500">
            Enviamos a todo Uruguay 🇺🇾
          </p>
          <InstagramContact 
            className="w-full mt-7" 
        />
          
        </section>

      </div>
    </div>
  );
}
