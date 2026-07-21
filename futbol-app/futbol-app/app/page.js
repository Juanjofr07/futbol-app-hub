"use client";

import Link from "next/link";

export default function HomeSelector() {
  return (
    <div className="min-h-screen bg-[#0B0C15] flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          GOL <span className="text-[#00FF9D]">BQTO</span>
        </h1>
        <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl mx-auto font-medium">
          Elige qué quieres jugar hoy: fútbol con tus panas o pádel en pareja.
        </p>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta Fútbol */}
        <Link
          href="/futbol"
          className="group bg-[#121422] rounded-3xl overflow-hidden border border-[#1f233a] shadow-2xl hover:shadow-[#00FF9D]/20 hover:-translate-y-1 transition-all flex flex-col"
        >
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1511886929837-354d827aae26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Fútbol"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] text-xs font-bold uppercase tracking-widest">
              Fútbol
            </span>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Juega fútbol en Barquisimeto
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Partidos organizados, sistema de créditos, carta de jugador y logros.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#00FF9D] text-[#0B0C15] text-xs font-black uppercase tracking-widest group-hover:bg-[#00e58d] transition-colors"
            >
              Entrar a fútbol
            </button>
          </div>
        </Link>

        {/* Tarjeta Pádel */}
        <Link
          href="/padel"
          className="group bg-[#121422] rounded-3xl overflow-hidden border border-[#1f233a] shadow-2xl hover:shadow-[#00FF9D]/20 hover:-translate-y-1 transition-all flex flex-col"
        >
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1630409340012-e5f72a6bbd65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Pádel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#00FF9D]/20 text-[#00FF9D] text-xs font-bold uppercase tracking-widest">
              Pádel
            </span>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Reserva partidos de pádel
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Próximos partidos de pádel, créditos y estadísticas adaptadas al deporte.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#00FF9D] text-[#0B0C15] text-xs font-black uppercase tracking-widest group-hover:bg-[#00e58d] transition-colors"
            >
              Entrar a pádel
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}