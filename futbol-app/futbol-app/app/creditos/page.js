"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

const PAQUETES = [
  {
    id: "starter",
    nombre: "Starter",
    partidos: 4,
    precio: 12,
    precioUnidad: 3.0,
    color: "from-gray-400 to-gray-500",
    popular: false,
    descripcion: "Para conocer la experiencia",
    icono: "⚡",
  },
  {
    id: "jugador",
    nombre: "Jugador",
    partidos: 8,
    precio: 20,
    precioUnidad: 2.5,
    color: "from-cancha-verde to-cancha-verdeoscuro",
    popular: true,
    descripcion: "El favorito de la comunidad",
    icono: "⚽",
  },
  {
    id: "pro",
    nombre: "Pro",
    partidos: 16,
    precio: 35,
    precioUnidad: 2.19,
    color: "from-yellow-400 to-orange-500",
    popular: false,
    descripcion: "Para los más comprometidos",
    icono: "🏆",
  },
  {
    id: "elite",
    nombre: "Élite",
    partidos: 30,
    precio: 60,
    precioUnidad: 2.0,
    color: "from-purple-500 to-purple-800",
    popular: false,
    descripcion: "Máximo ahorro y privilegios",
    icono: "👑",
  },
];

export default function Creditos() {
  const [creditosActuales, setCreditosActuales] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function cargar() {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      setUsuario(user);
      if (!user) return;
      const { data } = await supabase.from("perfiles").select("creditos").eq("id", user.id).single();
      setCreditosActuales(data?.creditos ?? 0);
    }
    cargar();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paquetes de créditos</h1>
          <p className="text-gray-500 text-sm mt-1">Cada crédito = 1 partido. Compra más y paga menos por partido.</p>
        </div>
        {creditosActuales !== null && (
          <div className="bg-cancha-verde/10 border border-cancha-verde/20 rounded-2xl px-4 py-3 text-right">
            <p className="text-xs text-gray-500">Mis créditos</p>
            <p className="text-2xl font-black text-cancha-verdeoscuro">{creditosActuales} ⚡</p>
          </div>
        )}
      </div>

      {/* Paquetes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAQUETES.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSeleccionado(pkg.id)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-105 ${
              seleccionado === pkg.id
                ? "ring-4 ring-cancha-amarillo scale-105"
                : "ring-0"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-3 right-3 z-10 bg-cancha-amarillo text-cancha-verdeoscuro text-xs font-black px-2 py-0.5 rounded-full">
                ★ Popular
              </div>
            )}
            <div className={`bg-gradient-to-br ${pkg.color} p-5 text-white`}>
              <div className="text-3xl mb-2">{pkg.icono}</div>
              <h3 className="font-black text-xl">{pkg.nombre}</h3>
              <p className="text-white/70 text-xs">{pkg.descripcion}</p>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-black text-gray-800">${pkg.precio}</span>
                <span className="text-gray-400 text-sm mb-1">USD</span>
              </div>
              <p className="text-cancha-verde font-semibold text-sm">{pkg.partidos} créditos</p>
              <p className="text-gray-400 text-xs">${pkg.precioUnidad.toFixed(2)}/partido</p>

              {/* Barra de ahorro visual */}
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-cancha-verde"
                    style={{ width: `${Math.round((1 - pkg.precioUnidad / 3) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{Math.round((1 - pkg.precioUnidad / 3) * 100)}% de ahorro vs precio único</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acción de compra */}
      {seleccionado && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          {(() => {
            const pkg = PAQUETES.find(p => p.id === seleccionado);
            return (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-800">Paquete {pkg.nombre} seleccionado</p>
                  <p className="text-gray-500 text-sm">{pkg.partidos} créditos por ${pkg.precio} USD</p>
                </div>
                {usuario ? (
                  <button
                    className="px-6 py-3 bg-cancha-verde text-white font-bold rounded-xl hover:bg-cancha-verdeoscuro transition-colors"
                    onClick={() => alert(`Integración de pago próximamente para el paquete ${pkg.nombre}`)}
                  >
                    Comprar ${pkg.precio} →
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-cancha-verde text-white font-bold rounded-xl hover:bg-cancha-verdeoscuro transition-colors"
                  >
                    Inicia sesión para comprar
                  </Link>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Info beneficios */}
      <div className="bg-gradient-to-br from-cancha-verdeoscuro to-cancha-verde rounded-2xl p-6 text-white">
        <h3 className="font-black text-lg mb-4">¿Por qué comprar créditos?</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "💸", title: "Más créditos, menos costo", desc: "El paquete Élite te ahorra 33% vs pagar por partido" },
            { icon: "⚡", title: "Reserva instantánea", desc: "Únete a partidos sin necesidad de pagar cada vez" },
            { icon: "🃏", title: "Sube tu carta", desc: "Juega más y desbloquea logros que mejoran tu media" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-white/70 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
