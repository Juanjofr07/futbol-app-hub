'use client';

import { getFlagEmoji } from '../lib/countries';

/**
 * Tiers de pádel basados en nivel (1.0 – 7.0)
 * Inspirado en el sistema de categorías de Playtomic / WPT.
 */
const PADEL_TIERS = [
  { min: 6.5, label: 'ÉLITE',   cardBg: 'linear-gradient(155deg,#1e3a8a 0%,#0f172a 100%)', textColor: '#f0f9ff', subText: '#7dd3fc', barBg: 'rgba(125,211,252,0.2)', ring: 'ring-sky-400/70',   glowColor: 'rgba(56,189,248,0.6)',  animClass: 'animate-glow-toty' },
  { min: 5.5, label: 'ORO',     cardBg: 'linear-gradient(155deg,#fef9c3 0%,#fbbf24 100%)', textColor: '#78350f', subText: '#92400e', barBg: 'rgba(146,64,14,0.15)',   ring: 'ring-amber-300/70', glowColor: 'rgba(217,119,6,0.45)',  animClass: 'animate-glow-oro' },
  { min: 4.0, label: 'PLATA',   cardBg: 'linear-gradient(155deg,#f8fafc 0%,#94a3b8 100%)', textColor: '#1e293b', subText: '#334155', barBg: 'rgba(51,65,85,0.15)',     ring: 'ring-slate-300/70', glowColor: 'rgba(100,116,139,0.35)', animClass: 'animate-glow-plata' },
  { min: 0,   label: 'BRONCE',  cardBg: 'linear-gradient(155deg,#c2794f 0%,#6f3a20 100%)', textColor: '#fff7ed', subText: '#fed7aa', barBg: 'rgba(0,0,0,0.2)',         ring: 'ring-orange-900/40', glowColor: 'rgba(111,58,32,0.4)',   animClass: 'animate-glow-bronce' },
];

const SIZES = {
  mini: { width: 'w-[150px]', avatar: 52, nivelText: 'text-3xl', labelText: 'text-[10px]', statText: 'text-[10px]', name: 'text-sm', pad: 'px-3 pt-4 pb-5', barPad: 'py-1.5', barText: 'text-[11px]', avatarMargin: 'mt-3 mb-2' },
  md:   { width: 'w-[230px]', avatar: 72, nivelText: 'text-4xl', labelText: 'text-xs',    statText: 'text-[11px]', name: 'text-sm', pad: 'px-3 pt-4',    barPad: 'py-1.5', barText: 'text-[11px]', avatarMargin: 'my-3' },
  lg:   { width: 'w-[300px]', avatar: 108, nivelText: 'text-6xl', labelText: 'text-sm',   statText: 'text-sm',     name: 'text-xl', pad: 'px-6 pt-8',    barPad: 'py-2.5', barText: 'text-sm',     avatarMargin: 'my-3' },
};

function getTier(nivel) {
  const n = Number(nivel) || 0;
  return PADEL_TIERS.find((t) => n >= t.min) ?? PADEL_TIERS[PADEL_TIERS.length - 1];
}

function Avatar({ src, alt, size }) {
  return (
    <div className="rounded-full bg-white/70 border-4 border-white/80 shadow-md overflow-hidden flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {src
        ? <img src={src} alt={alt} className="w-full h-full object-cover" />
        : <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-slate-400" fill="currentColor" aria-hidden="true"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" /></svg>
      }
    </div>
  );
}

function Sheen() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 animate-sheen motion-reduce:animate-none" style={{ background: 'linear-gradient(75deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)' }} />;
}

/**
 * PadelPlayerCard
 *
 * Props:
 *   nombre        {string}  Nombre del jugador
 *   nivel         {number}  Nivel de pádel 1.0 – 7.0
 *   lado          {string}  'derecha' | 'izquierda'
 *   victorias     {number}
 *   derrotas      {number}
 *   puntos        {number}  Puntos ELO / ranking
 *   nacionalidad  {string}  Código ISO de país (opcional)
 *   avatar        {string}  URL de la foto (opcional)
 *   mini          {boolean} Tamaño mini
 *   size          {string}  'mini' | 'md' | 'lg'
 */
export default function PadelPlayerCard({
  nombre = 'Jugador',
  nivel = 1.0,
  lado = 'derecha',
  victorias = 0,
  derrotas = 0,
  puntos = 1000,
  nacionalidad = null,
  avatar = null,
  mini = false,
  size,
}) {
  const nivelSeguro = Number(nivel) || 0;
  const nombreSeguro = nombre?.trim() || 'Jugador';
  const tier = getTier(nivelSeguro);
  const resolvedSize = size || (mini ? 'mini' : 'md');
  const dims = SIZES[resolvedSize] ?? SIZES.md;
  const isMini = resolvedSize === 'mini';
  const bandera = nacionalidad ? getFlagEmoji(nacionalidad) : '';

  const totalPartidos = victorias + derrotas;
  const winRate = totalPartidos > 0 ? Math.round((victorias / totalPartidos) * 100) : 0;

  const ladoLabel = lado?.toLowerCase() === 'izquierda' ? '◀ IZQ' : 'DER ▶';

  const stats = [
    { label: 'V',    value: victorias },
    { label: 'D',    value: derrotas },
    { label: 'WIN%', value: `${winRate}%` },
    { label: 'PTS',  value: puntos },
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] ring-1 ${tier.ring} ${tier.animClass} motion-reduce:animate-none ${dims.width}`}
      style={{ background: tier.cardBg, '--glow-color': tier.glowColor }}
    >
      <Sheen />

      <div className={`relative flex flex-col items-center ${dims.pad}`}>
        {/* Nivel */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
          <span className={`${dims.labelText} font-bold tracking-[0.2em]`} style={{ color: tier.subText }}>NIV</span>
          <span className={`${dims.nivelText} font-black leading-none`} style={{ color: tier.textColor }}>
            {nivelSeguro.toFixed(1)}
          </span>
        </div>

        {/* Badge: lado + bandera */}
        <span
          className="mt-11 px-3 py-0.5 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide rounded-full whitespace-nowrap"
          style={{ background: tier.barBg, color: tier.subText }}
        >
          <span>🎾 {ladoLabel}</span>
          {bandera ? (<><span className="opacity-50">|</span><span aria-label={String(nacionalidad).toUpperCase()}>{bandera}</span></>) : null}
        </span>

        {/* Avatar */}
        <div className={dims.avatarMargin}>
          <Avatar src={avatar} alt={nombreSeguro} size={dims.avatar} />
        </div>

        {/* Nombre */}
        <p className={`text-center ${dims.name} font-extrabold leading-tight line-clamp-2 px-1 mb-3`} style={{ color: tier.textColor }}>
          {nombreSeguro}
        </p>

        {/* Stats grid (oculto en mini) */}
        {!isMini && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full pb-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-1">
                <span className={`${dims.statText} font-black`} style={{ color: tier.textColor }}>{s.value}</span>
                <span className={`${dims.statText} font-semibold opacity-70`} style={{ color: tier.subText }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer tier */}
      <div
        className={`relative ${dims.barPad} text-center ${dims.barText} font-bold tracking-[0.15em]`}
        style={{ background: tier.barBg, color: tier.subText }}
      >
        {tier.label}
      </div>
    </div>
  );
}
