"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import PlayerCard from "../../components/PlayerCard";
import Link from "next/link";

const LOGROS_DEF = [
  {
    id: "primer_partido",
    icon: "⚽",
    label: "Primer partido",
    desc: "Juega tu primer partido",
    bonusText: "+1 media",
    bonusMedia: 1,
    bonusStats: {},
    condicion: (s) => s.partidos_jugados >= 1,
  },
  {
    id: "veterano",
    icon: "🏆",
    label: "Veterano",
    desc: "Juega 10 partidos",
    bonusText: "+5 media",
    bonusMedia: 5,
    bonusStats: {},
    condicion: (s) => s.partidos_jugados >= 10,
  },
  {
    id: "goleador",
    icon: "👑",
    label: "Goleador",
    desc: "Anota 10 goles en total",
    bonusText: "+3 TIR",
    bonusMedia: 0,
    bonusStats: { tiro: 3 },
    condicion: (s) => s.goles_total >= 10,
  },
];

function valor(...opciones) {
  for (const v of opciones) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
}

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [mensajeFoto, setMensajeFoto] = useState("");
  const [errorCarga, setErrorCarga] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setErrorCarga("");

        if (!supabase) {
          setErrorCarga("Supabase no está disponible.");
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error auth perfil:", userError);
          setErrorCarga("No se pudo validar la sesión.");
          return;
        }

        if (!user) return;

        setUserId(user.id);

        const { data: p, error: perfilError } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (perfilError) {
          console.error("Error perfil:", perfilError);
          setErrorCarga(perfilError.message || "No se pudo cargar el perfil.");
          return;
        }

        const partidos_jugados = Number(
          valor(p.partidosjugados, p.partidos_jugados, 0)
        );
        const goles_total = Number(
          valor(p.golestotal, p.goles_total, 0)
        );
        const victorias = Number(valor(p.victorias, 0));
        const derrotas = Number(valor(p.derrotas, 0));

        const promedio_goles =
          partidos_jugados > 0
            ? (goles_total / partidos_jugados).toFixed(2)
            : "0.00";

        const ratio_vd =
          derrotas > 0
            ? (victorias / derrotas).toFixed(2)
            : victorias > 0
            ? "∞"
            : "0.00";

        const perfilNormalizado = {
          ...p,
          nombre: valor(p.nombre, "Jugador"),
          telefono: valor(p.telefono, "Sin teléfono"),
          nacionalidad: valor(p.nacionalidad, null),
          posicion: valor(
            p.posicionpreferida,
            p.posicion_preferida,
            p.posicion,
            "MED"
          ),
          media: Number(valor(p.mediageneral, p.media_general, 64)),
          avatar: valor(p.avatarurl, p.avatar_url, null),
          creditos: Number(valor(p.creditos, 0)),
        };

        setPerfil(perfilNormalizado);

        setStats({
          partidos_jugados,
          goles_total,
          media_general: perfilNormalizado.media,
          ritmo: Number(valor(p.ritmo, 64)),
          tiro: Number(valor(p.tiro, 64)),
          pase: Number(valor(p.pase, 64)),
          regate: Number(valor(p.regate, 64)),
          defensa: Number(valor(p.defensa, 64)),
          fisico: Number(valor(p.fisico, 64)),
          victorias,
          derrotas,
          promedio_goles,
          ratio_vd,
        });
      } catch (error) {
        console.error("Error general perfil:", error);
        setErrorCarga("Ocurrió un error cargando el perfil.");
      } finally {
        setCargando(false);
      }
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
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData?.publicUrl;
      if (!avatarUrl) {
        setMensajeFoto("No se pudo obtener la URL pública de la foto.");
        return;
      }

      const { error: updateError } = await supabase
        .from("perfiles")
        .update({ avatarurl: avatarUrl })
        .eq("id", userId);

      if (updateError) {
        setMensajeFoto(updateError.message);
        return;
      }

      setPerfil((prev) => ({ ...prev, avatar: avatarUrl }));
      setMensajeFoto("Foto actualizada correctamente.");
    } catch (error) {
      console.error("Error subiendo foto:", error);
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

  if (errorCarga) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
        {errorCarga}
      </div>
    );
  }

  if (!perfil || !stats) {
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

  const logrosDesbloqueados = LOGROS_DEF.filter((l) => l.condicion(stats));

  // === BONOS APLICADOS SOLO EN LA CARTA ===
  const bonusMediaTotal = logrosDesbloqueados.reduce(
    (acc, l) => acc + (l.bonusMedia || 0),
    0
  );

  const bonusStats = logrosDesbloqueados.reduce(
    (acc, l) => {
      const b = l.bonusStats || {};
      return {
        ritmo: (acc.ritmo || 0) + (b.ritmo || 0),
        tiro: (acc.tiro || 0) + (b.tiro || 0),
        pase: (acc.pase || 0) + (b.pase || 0),
        regate: (acc.regate || 0) + (b.regate || 0),
        defensa: (acc.defensa || 0) + (b.defensa || 0),
        fisico: (acc.fisico || 0) + (b.fisico || 0),
      };
    },
    {}
  );

  const mediaConBonos = stats.media_general + bonusMediaTotal;

  const statsConBonos = {
    ritmo: stats.ritmo + (bonusStats.ritmo || 0),
    tiro: stats.tiro + (bonusStats.tiro || 0),
    pase: stats.pase + (bonusStats.pase || 0),
    regate: stats.regate + (bonusStats.regate || 0),
    defensa: stats.defensa + (bonusStats.defensa || 0),
    fisico: stats.fisico + (bonusStats.fisico || 0),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi perfil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carta */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-700">🃏 Mi carta</h2>
          <PlayerCard
            nombre={perfil.nombre}
            posicion={perfil.posicion}
            media={mediaConBonos}
            stats={statsConBonos}
            avatar={perfil.avatar}
            nacionalidad={perfil.nacionalidad}
            size="lg"
          />
        </div>

        {/* Panel derecho (foto, créditos, stats rápidas, logros) */}
        <div className="flex flex-col gap-4">
          {/* ... todo tu panel igual ... */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            {/* contenido de foto, créditos, stats rápidas */}
            {/* (igual que el código que ya tienes, no lo repito por longitud) */}
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">🏆 Logros</h2>
            <div className="grid grid-cols-2 gap-2">
              {LOGROS_DEF.map((logro) => {
                const desbloqueado = logrosDesbloqueados.some(
                  (l) => l.id === logro.id
                );
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
                    <p className="text-xs font-semibold text-gray-700">
                      {logro.label}
                    </p>
                    <p className="text-xs text-cancha-verde font-medium">
                      {logro.bonusText}
                    </p>
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
