import { supabase } from "../../../lib/supabaseClient";
import PlayerCard from "../../../components/PlayerCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JugadorDetalle({ params }) {
  if (!supabase) return notFound();

  const [{ data: perfil }, { data: stats }, { data: historial }] = await Promise.all([
    supabase.from("perfiles").select("*").eq("id", params.id).single(),
    supabase.from("estadisticas_jugador").select("*").eq("usuario_id", params.id).single(),
    supabase
      .from("inscripciones")
      .select("partido_id, goles, asistencias, partidos(cancha, fecha, hora)")
      .eq("usuario_id", params.id)
      .order("partido_id", { ascending: false })
      .limit(10),
  ]);

  if (!perfil) return notFound();

  const st = stats || {
    media_general: 65, ritmo: 65, tiro: 63, pase: 62,
    regate: 65, defensa: 40, fisico: 63, nivel: 1,
    partidos_jugados: 0, goles_total: 0, asistencias_total: 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/jugadores" className="text-sm text-cancha-verde hover:underline">← Volver a jugadores</Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carta */}
        <PlayerCard
          nombre={perfil.nombre || "Jugador"}
          posicion={perfil.posicion || "MED"}
          media={st.media_general}
          stats={{
            ritmo: st.ritmo,
            tiro: st.tiro,
            pase: st.pase,
            regate: st.regate,
            defensa: st.defensa,
            fisico: st.fisico,
          }}
          nivel={st.nivel}
          partidosJugados={st.partidos_jugados}
          goles={st.goles_total}
          asistencias={st.asistencias_total}
          avatar={perfil.avatar_url}
        />

        {/* Detalles */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-800 text-lg">{perfil.nombre || "Jugador"}</h2>
            <p className="text-gray-500 text-sm mt-1">{perfil.posicion || "Sin posición"}</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Partidos", value: st.partidos_jugados },
                { label: "Goles", value: st.goles_total },
                { label: "Asistencias", value: st.asistencias_total },
              ].map(({ label, value }) => (
                <div key={label} className="bg-cancha-gris rounded-xl p-3 text-center">
                  <div className="font-black text-cancha-verdeoscuro text-xl">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Historial */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h3 className="font-semibold text-gray-700 mb-3">Últimos partidos</h3>
            {!historial || historial.length === 0 ? (
              <p className="text-sm text-gray-400">Sin partidos jugados aún.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {historial.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-medium text-gray-700">{h.partidos?.cancha}</p>
                      <p className="text-xs text-gray-400">{h.partidos?.fecha} · {h.partidos?.hora}</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="font-bold text-cancha-verde">{h.goles || 0} ⚽</span>
                      <span className="font-bold text-blue-500">{h.asistencias || 0} 🎯</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
