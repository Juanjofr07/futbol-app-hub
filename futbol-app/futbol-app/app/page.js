"use client";

import Link from "next/link";

export default function HubHome() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-12">

      {/* LOGO / TÍTULO */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🏟️</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            SportHub
          </h1>
        </div>
        <p className="text-sm text-zinc-400 text-center max-w-sm leading-relaxed">
          Una cuenta. Todos tus deportes. Organiza partidos, lleva estadísticas y juega con tu gente.
        </p>

        {/* Botones sesión */}
        <div className="flex gap-3 mt-6">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-200 active:scale-95 transition-all"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 active:scale-95 transition-all"
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* ELIGE TU DEPORTE */}
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500 mb-5">
        Elige tu deporte
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">

        {/* ── FÚTBOL ── */}
        <Link
          href="/futbol"
          className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl cursor-pointer aspect-[4/3] md:aspect-auto md:h-80"
        >
          {/* Imagen de fondo */}
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&q=80"
            alt="Fútbol"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          {/* Glow verde en hover */}
          <div className="absolute inset-0 ring-inset ring-0 group-hover:ring-2 group-hover:ring-emerald-400/60 rounded-3xl transition-all duration-300" />

          {/* Contenido */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <span className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/10">
              ⚽ Fútbol
            </span>
            <div>
              <h2 className="text-3xl font-black leading-tight drop-shadow-lg">
                Juega partidos<br />de fútbol
              </h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-[22ch]">
                Organiza partidos, lleva tus stats y mejora tu carta de jugador.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:gap-3 transition-all">
                Entrar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* ── PÁDEL ── */}
        <Link
          href="/padel"
          className="group relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl cursor-pointer aspect-[4/3] md:aspect-auto md:h-80"
        >
          {/* Imagen de fondo */}
          <img
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80"
            alt="Pádel"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
          {/* Glow azul en hover */}
          <div className="absolute inset-0 ring-inset ring-0 group-hover:ring-2 group-hover:ring-sky-400/60 rounded-3xl transition-all duration-300" />

          {/* Contenido */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <span className="self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/10">
              🎾 Pádel
            </span>
            <div>
              <h2 className="text-3xl font-black leading-tight drop-shadow-lg">
                Reserva y<br />juega pádel
              </h2>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-[22ch]">
                Reserva canchas, gestiona tus torneos y lleva tus estadísticas.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sky-400 font-bold text-sm group-hover:gap-3 transition-all">
                Entrar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

      </div>

      {/* Footer mínimo */}
      <p className="mt-10 text-xs text-zinc-600">
        SportHub © {new Date().getFullYear()} · Hecho con ❤️ para jugadores
      </p>
    </main>
  );
}
