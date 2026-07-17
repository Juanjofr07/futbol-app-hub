import PartidoCard from "../components/PartidoCard";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let partidos = [];

  if (supabase) {
    const { data } = await supabase
      .from("partidos")
      .select("*, inscripciones(count)")
      .order("fecha", { ascending: true });
    partidos = data || [];
  }

  const proximos = partidos.slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cancha-verdeoscuro to-cancha-verde rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-9xl opacity-10">⚽</div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black leading-tight">
            Fútbol en <span className="text-cancha-amarillo">Barquisimeto</span>
          </h1>
          <p className="mt-2 text-white/80 text-base max-w-md">
            Únete a partidos organizados en las mejores canchas de la ciudad. Sin equipo, sin excusas.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link
              href="#partidos"
              className="px-5 py-2.5 bg-cancha-amarillo text-cancha-verdeoscuro font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors"
            >
              Ver partidos ⚡
            </Link>
            <Link
              href="/creditos"
              className="px-5 py-2.5 bg-white/15 text-white font-semibold rounded-xl text-sm hover:bg-white/25 transition-colors"
            >
              Comprar créditos
            </Link>
          </div>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "🏟️", label: "Canchas", value: "6+" },
          { icon: "⚽", label: "Partidos/semana", value: "12+" },
          { icon: "👥", label: "Jugadores", value: "200+" },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-card">
            <div className="text-2xl">{icon}</div>
            <div className="font-black text-cancha-verdeoscuro text-xl mt-1">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Lista de partidos */}
      <div id="partidos">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Próximos partidos</h2>
          <span className="text-sm text-cancha-verde font-medium">{partidos.length} disponibles</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {partidos.length === 0 && (
            <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-gray-400 shadow-card">
              <div className="text-4xl mb-2">📅</div>
              <p>Todavía no hay partidos publicados.</p>
            </div>
          )}
          {partidos.map((partido) => (
            <PartidoCard
              key={partido.id}
              partido={{
                id: partido.id,
                cancha: partido.cancha,
                zona: partido.zona,
                fecha: partido.fecha,
                hora: partido.hora,
                cuposTotales: partido.cupos_totales,
                cuposOcupados: partido.inscripciones?.[0]?.count || 0,
                precio: partido.precio,
              }}
            />
          ))}
        </div>
      </div>

      {/* CTA Gamificación */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
        <h3 className="font-black text-lg">🃏 Tu carta de jugador te espera</h3>
        <p className="text-white/80 text-sm mt-1">
          Juega partidos, acumula logros y sube la media de tu carta. Hat trick = +3 media.
        </p>
        <Link
          href="/perfil"
          className="inline-block mt-4 px-4 py-2 bg-cancha-amarillo text-purple-900 font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors"
        >
          Ver mi carta →
        </Link>
      </div>
    </div>
  );
}
