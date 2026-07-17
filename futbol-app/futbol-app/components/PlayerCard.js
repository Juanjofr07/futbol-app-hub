"use client";

/**
 * PlayerCard: carta estilo FIFA Ultimate Team
 * Props:
 *   - nombre: string
 *   - posicion: string (e.g. "DEL", "MED", "DEF", "POR")
 *   - media: number (0-99)
 *   - stats: { ritmo, tiro, pase, regate, defensa, fisico } (0-99 cada uno)
 *   - nivel: number (1-5)
 *   - partidosJugados: number
 *   - goles: number
 *   - asistencias: number
 *   - avatar: string (URL opcional)
 */

const NIVEL_COLORES = [
  "from-gray-400 to-gray-500",      // Nivel 1 - Bronce
  "from-gray-300 to-gray-400",      // Nivel 2 - Plata baja
  "from-yellow-400 to-yellow-600",  // Nivel 3 - Oro
  "from-purple-400 to-purple-700",  // Nivel 4 - Élite
  "from-cancha-amarillo to-orange-500", // Nivel 5 - Leyenda
];

const NIVEL_LABELS = ["Bronce", "Plata", "Oro", "Élite", "Leyenda"];

function StatBar({ label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-bold text-white/80 w-8">{value}</span>
      <div className="flex-1 bg-white/20 rounded-full h-1">
        <div
          className="h-1 rounded-full bg-cancha-amarillo"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-white/60 w-6">{label}</span>
    </div>
  );
}

export default function PlayerCard({
  nombre = "Jugador",
  posicion = "DEL",
  media = 70,
  stats = { ritmo: 70, tiro: 68, pase: 65, regate: 72, defensa: 40, fisico: 66 },
  nivel = 1,
  partidosJugados = 0,
  goles = 0,
  asistencias = 0,
  avatar = null,
  mini = false,
}) {
  const nivelIdx = Math.min(Math.max(nivel - 1, 0), 4);
  const gradiente = NIVEL_COLORES[nivelIdx];
  const nivelLabel = NIVEL_LABELS[nivelIdx];

  if (mini) {
    return (
      <div className={`relative card-shine bg-gradient-to-br ${gradiente} rounded-xl p-3 shadow-lg text-white w-28 flex flex-col items-center gap-1`}>
        <span className="text-xs font-bold opacity-80">{nivelLabel}</span>
        <span className="text-2xl font-black">{media}</span>
        <span className="text-xs font-bold">{posicion}</span>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
          {avatar ? <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt={nombre} /> : "👤"}
        </div>
        <span className="text-xs font-semibold text-center leading-tight">{nombre}</span>
      </div>
    );
  }

  return (
    <div className={`relative card-shine bg-gradient-to-br ${gradiente} rounded-2xl p-5 shadow-xl text-white w-full max-w-xs mx-auto`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-4xl font-black leading-none">{media}</div>
          <div className="text-sm font-bold mt-0.5">{posicion}</div>
          <div className="text-xs opacity-70 mt-1">{nivelLabel}</div>
        </div>
        <div className="w-20 h-20 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center text-4xl">
          {avatar
            ? <img src={avatar} className="w-full h-full object-cover" alt={nombre} />
            : "👤"}
        </div>
      </div>

      {/* Nombre */}
      <div className="text-center font-black text-lg tracking-wide mb-3 drop-shadow">
        {nombre.toUpperCase()}
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1.5 mb-3">
        <StatBar label="RIT" value={stats.ritmo} />
        <StatBar label="TIR" value={stats.tiro} />
        <StatBar label="PAS" value={stats.pase} />
        <StatBar label="REG" value={stats.regate} />
        <StatBar label="DEF" value={stats.defensa} />
        <StatBar label="FIS" value={stats.fisico} />
      </div>

      {/* Footer stats */}
      <div className="flex justify-around border-t border-white/20 pt-3 text-center">
        <div>
          <div className="text-lg font-bold">{partidosJugados}</div>
          <div className="text-xs opacity-70">Partidos</div>
        </div>
        <div>
          <div className="text-lg font-bold">{goles}</div>
          <div className="text-xs opacity-70">Goles</div>
        </div>
        <div>
          <div className="text-lg font-bold">{asistencias}</div>
          <div className="text-xs opacity-70">Asist.</div>
        </div>
      </div>
    </div>
  );
}
