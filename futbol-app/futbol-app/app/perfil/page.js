"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PlayerCard from "../../components/PlayerCard";
import Link from "next/link";

// Logros con sus condiciones y recompensas
const LOGROS_DEF = [
  { id: "hat_trick", icon: "🎩", label: "Hat Trick", desc: "Anota 3+ goles en un partido", bonus: "+3 media", condicion: (s) => s.max_goles_partido >= 3 },
  { id: "portero_valla", icon: "🧤", label: "Valla invicta", desc: "Partido con 0 goles en contra", bonus: "+2 DEF", condicion: (s) => s.vallas_invictas > 0 },
  { id: "pocos_goles", icon: "🛡️", label: "Defensa sólida", desc: "Partido con menos de 3 goles en contra", bonus: "+2 media, +2 DEF", condicion: (s) => s.partidos_menos3_goles > 0 },
  { id: "primer_partido", icon: "⚽", label: "Primer partido", desc: "Juega tu primer partido", bonus: "+1 media", condicion: (s) => s.partidos_jugados >= 1 },
  { id: "veterano", icon: "🏆", label: "Veterano", desc: "Juega 10 partidos", bonus: "+5 media", condicion: (s) => s.partidos_jugados >= 10 },
  { id: "goleador", icon: "👑", label: "Goleador", desc: "Anota 10 goles en total", bonus: "+3 TIR", condicion: (s) => s.goles_total >= 10 },
];

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [mensajeFoto, setMensajeFoto] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function cargar() {
      if (!supabase) {
        setCargando(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCargando(false);
        return;
      }

      setUserId(user.id);

      const [{ data: p }, { data: st }] = await Promise.all([
        supabase.from("perfiles").select("*").eq("id", user.id).single(),
        supabase.from("estadisticas_jugador").select("*").eq("usuario_id", user.id).single(),
      ]);

      setPerfil(p);
      setStats(
        st || {
          partidos_jugados: 0,
          goles_total: 0,
          asistencias_total: 0,
          media_general: 65,
          ritmo: 65,
          tiro: 63,
          pase: 62,
          regate: 65,
          defensa: 40,
          fisico: 63,
          nivel: 1,
          max_goles_partido: 0,
          vallas_invictas: 0,
          partidos_menos3_goles: 0,
        }
      );
      setCargando(false);
    }

    cargar();
  }, []);

  async function subirFoto(e) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !userId) return;

    setMensajeFoto("");

    if (!file.type.startsWith("image/")) {
      setMensajeFoto("Solo puedes subir imágenes.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMensajeFoto("La imagen no puede pesar más de 2MB.");
      return;
    }

    try {
      setSubiendoFoto(true);

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        setMensajeFoto(uploadError.message);
        setSubiendoFoto(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatar_url = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("perfiles")
        .update({ avatar_url })
        .eq("id", userId);

      if (updateError) {
        setMensajeFoto(updateError.message);
        setSubiendoFoto(false);
        return;
      }

      setPerfil((prev) => ({ ...prev, avatar_url }));
      setMensajeFoto("Foto actualizada correctamente.");
    } catch (error) {
      setMensajeFoto("Ocurrió un error subiendo la foto.");
    } finally {
      setSubiendoFoto(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⚽</div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-6xl">🔐</div>
        <h1 className="text-2xl font-bold text-gray-800">Accede a tu perfil</h1>
        <p className="text-gray-500 text-center max-w-sm">
          Inicia sesión para ver tu carta de jugador, tus estadísticas y tus logros.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-cancha-verde text-white font-bold rounded-xl hover:bg-cancha-verdeoscuro transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const logrosDesbloqueados = stats ? LOGROS_DEF.filter((l) => l.condicion(stats)) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi perfil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carta del jugador */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-700">🃏 Mi carta</h2>
          <PlayerCard
  nombre={perfil.nombre || "Jugador"}
  posicion={perfil.posicion || "MED"}
  media={stats?.media_general || 65}
  stats={{
    ritmo: stats?.ritmo || 65,
    tiro: stats?.tiro || 63,
    pase: stats?.pase || 62,
    regate: stats?.regate || 65,
    defensa: stats?.defensa || 40,
    fisico: stats?.fisico || 63,
  }}
  nivel={stats?.nivel || 1}
  partidosJugados={stats?.partidos_jugados || 0}
  goles={stats?.goles_total || 0}
  asistencias={stats?.asistencias_total || 0}
  avatar={perfil.avatar_url || null}
/>
        </div>

        {/* Info + Logros */}
        <div className="flex flex-col gap-4">
          {/* Info básica */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-cancha-verde/20 flex items-center justify-center text-cancha-verdeoscuro font-bold text-xl">
                {perfil.avatar_url ? (
                  <img
                    src={perfil.avatar_url}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  perfil.nombre ? perfil.nombre.slice(0, 2).toUpperCase() : "?"
                )}
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-800">{perfil.nombre || "Sin nombre"}</p>
                <p className="text-sm text-gray-500">{perfil.telefono}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Subir foto de perfil
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={subirFoto}
                className="text-sm text-gray-600"
                disabled={subiendoFoto}
              />
              {subiendoFoto && (
                <p className="text-xs text-gray-500">Subiendo foto...</p>
              )}
              {mensajeFoto && (
                <p className="text-xs text-gray-500">{mensajeFoto}</p>
              )}
            </div>

            {/* Créditos */}
            <div className="mt-4 flex items-center justify-between bg-cancha-gris rounded-xl p-3">
              <div>
                <p className="text-xs text-gray-500">Créditos disponibles</p>
                <p className="font-black text-cancha-verdeoscuro text-xl">
                  {perfil.creditos || 0} ⚡
                </p>
              </div>
              <Link
                href="/creditos"
                className="px-3 py-1.5 bg-cancha-verde text-white text-xs font-semibold rounded-lg hover:bg-cancha-verdeoscuro transition-colors"
              >
                Recargar
              </Link>
            </div>
          </div>

          {/* Logros */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">🏆 Logros</h2>
            <div className="grid grid-cols-2 gap-2">
              {LOGROS_DEF.map((logro) => {
                const desbloqueado = logrosDesbloqueados.some((l) => l.id === logro.id);
                return (
                  <div
                    key={logro.id}
                    className={`rounded-xl p-3 flex flex-col gap-1 transition-all ${
                      desbloqueado
                        ? "bg-cancha-verde/10 border border-cancha-verde/30"
                        : "bg-gray-50 border border-gray-100 opacity-50"
                    }`}
                  >
                    <span className="text-xl">{logro.icon}</span>
                    <p className="text-xs font-semibold text-gray-700">{logro.label}</p>
                    <p className="text-xs text-cancha-verde font-medium">{logro.bonus}</p>
                    <p className="text-xs text-gray-400">{logro.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
