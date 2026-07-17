"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function formatFecha(fechaStr) {
  if (!fechaStr) return "";
  const d = new Date(fechaStr + "T00:00:00");
  return `${DIAS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export default function PartidoCard({ partido }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cuposLibres = partido.cuposTotales - partido.cuposOcupados;
  const lleno = cuposLibres <= 0;
  const ocupacion = Math.round((partido.cuposOcupados / partido.cuposTotales) * 100);

  async function unirse() {
    if (!supabase) return;

    setCargando(true);
    setMensaje("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("Primero inicia sesión para unirte.");
      setCargando(false);
      return;
    }

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("creditos")
      .eq("id", user.id)
      .single();

    const creditos = perfil?.creditos ?? 0;

    if (creditos < 1) {
      setMensaje("No tienes créditos suficientes. Recarga antes de unirte.");
      setCargando(false);
      return;
    }

    const { data: yaInscrito } = await supabase
      .from("inscripciones")
      .select("id")
      .eq("partido_id", partido.id)
      .eq("usuario_id", user.id)
      .maybeSingle();

    if (yaInscrito) {
      setMensaje("Ya estás inscrito en este partido.");
      setCargando(false);
      return;
    }

    const nuevoBalance = creditos - 1;

    const { error: updateError } = await supabase
      .from("perfiles")
      .update({ creditos: nuevoBalance })
      .eq("id", user.id);

    if (updateError) {
      setMensaje("No se pudo descontar el crédito.");
      setCargando(false);
      return;
    }

    const { error: inscripcionError } = await supabase
      .from("inscripciones")
      .insert({ partido_id: partido.id, usuario_id: user.id });

    if (inscripcionError) {
      await supabase.from("perfiles").update({ creditos }).eq("id", user.id);
      setMensaje("No se pudo unir al partido.");
      setCargando(false);
      return;
    }

    await supabase.from("credit_ledger").insert({
      user_id: user.id,
      partido_id: partido.id,
      delta: -1,
      reason: "match_join",
      balance_after: nuevoBalance,
    });

    setMensaje("¡Te uniste al partido! Se descontó 1 crédito.");
    setCargando(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-cancha-verdeoscuro to-cancha-verde px-5 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base">{partido.cancha}</h3>
          <p className="text-white/70 text-xs">{partido.zona}</p>
        </div>
        <div className="text-right">
          <span className="text-cancha-amarillo font-bold text-lg">${partido.precio}</span>
          <p className="text-white/60 text-xs">equivale a 1 crédito</p>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span>📅</span> {formatFecha(partido.fecha)}
          </span>
          <span className="flex items-center gap-1">
            <span>⏰</span> {partido.hora}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{lleno ? "Cupo lleno" : `${cuposLibres} cupos disponibles`}</span>
            <span>{partido.cuposOcupados}/{partido.cuposTotales}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                lleno ? "bg-red-400" : ocupacion > 70 ? "bg-yellow-400" : "bg-cancha-verde"
              }`}
              style={{ width: `${Math.min(ocupacion, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            disabled={lleno || cargando}
            onClick={unirse}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              lleno || cargando
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-cancha-verde text-white hover:bg-cancha-verdeoscuro active:scale-95"
            }`}
          >
            {lleno ? "Sin cupo" : cargando ? "Procesando..." : "⚡ Unirme"}
          </button>
          <Link
            href={`/partido/${partido.id}`}
            className="px-4 py-2.5 rounded-xl border border-cancha-verde text-cancha-verdeoscuro text-sm font-medium hover:bg-cancha-verde/5 transition-colors"
          >
            Ver
          </Link>
        </div>

        {mensaje && (
          <p
            className={`text-xs text-center rounded-lg py-1.5 px-2 ${
              mensaje.includes("uniste")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
