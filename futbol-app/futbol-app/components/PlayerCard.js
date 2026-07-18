const TIERS = [
  {
    min: 99,
    label: "TOTY",
    cardBg: "linear-gradient(155deg,#1d4ed8 0%,#0b1120 100%)",
    textColor: "#f8fafc",
    subText: "#93c5fd",
    barBg: "rgba(147,197,253,0.25)",
    ring: "ring-blue-400/70",
    glowColor: "rgba(59,130,246,0.6)",
    animClass: "animate-glow-toty",
    sparkle: false,
  },
  {
    min: 90,
    label: "ICONO",
    cardBg: "linear-gradient(155deg,#fffdf7 0%,#fde68a 100%)",
    textColor: "#78350f",
    subText: "#b45309",
    barBg: "rgba(180,83,9,0.15)",
    ring: "ring-yellow-400/80",
    glowColor: "rgba(234,179,8,0.55)",
    animClass: "animate-glow-icono",
    sparkle: true,
  },
  {
    min: 80,
    label: "ORO",
    cardBg: "linear-gradient(155deg,#fef9c3 0%,#fbbf24 100%)",
    textColor: "#78350f",
    subText: "#92400e",
    barBg: "rgba(146,64,14,0.15)",
    ring: "ring-amber-300/70",
    glowColor: "rgba(217,119,6,0.45)",
    animClass: "animate-glow-oro",
    sparkle: false,
  },
  {
    min: 70,
    label: "PLATA",
    cardBg: "linear-gradient(155deg,#f8fafc 0%,#94a3b8 100%)",
    textColor: "#1e293b",
    subText: "#334155",
    barBg: "rgba(51,65,85,0.15)",
    ring: "ring-slate-300/70",
    glowColor: "rgba(100,116,139,0.35)",
    animClass: "animate-glow-plata",
    sparkle: false,
  },
  {
    min: 0,
    label: "BRONCE",
    cardBg: "linear-gradient(155deg,#c2794f 0%,#6f3a20 100%)",
    textColor: "#fff7ed",
    subText: "#fed7aa",
    barBg: "rgba(0,0,0,0.2)",
    ring: "ring-orange-900/40",
    glowColor: "rgba(111,58,32,0.4)",
    animClass: "animate-glow-bronce",
    sparkle: false,
  },
];

function getTier(media) {
  return TIERS.find((t) => media >= t.min) ?? TIERS[TIERS.length - 1];
}

function Avatar({ src, alt, size }) {
  return (
    <div
      className="rounded-full bg-white/70 border-4 border-white/80 shadow-md overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <svg viewBox="0 0 24 24" className="w-2/3 h-2/3 text-slate-400" fill="currentColor">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
        </svg>
      )}
    </div>
  );
}

function Sparkle({ className = "", size = 12, delay = "0s", color = "#fff" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      className={`pointer-events-none absolute animate-sparkle motion-reduce:animate-none ${className}`}
      style={{ width: size, height: size, animationDelay: delay }}
    >
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
    </svg>
  );
}

export default function PlayerCard({
  nombre = "Jugador",
  posicion = "MED",
  media = 65,
  stats,
  nivel,
  avatar,
  mini = false,
}) {
  const tier = getTier(media);

  const attrs = stats
    ? [
        { label: "RIT", value: stats.ritmo },
        { label: "TIR", value: stats.tiro },
        { label: "PAS", value: stats.pase },
        { label: "REG", value: stats.regate },
        { label: "DEF", value: stats.defensa },
        { label: "FIS", value: stats.fisico },
      ]
    : [];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.4rem] ring-1 ${tier.ring} ${tier.animClass} motion-reduce:animate-none ${
        mini ? "w-[150px]" : "w-[230px]"
      }`}
      style={{ background: tier.cardBg, "--glow-color": tier.glowColor }}
    >
      {tier.sparkle && (
        <>
          <Sparkle className="top-[8%] left-[14%]" size={14} delay="0s" color={tier.subText} />
          <Sparkle className="top-[18%] right-[10%]" size={10} delay="0.6s" color={tier.subText} />
          <Sparkle className="bottom-[36%] right-[16%]" size={12} delay="1.1s" color={tier.subText} />
        </>
      )}

      <div className="relative flex flex-col items-center px-3 pt-4">
        <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: tier.subText }}>
          OVR
        </span>
        <span className="text-3xl font-black leading-none" style={{ color: tier.textColor }}>
          {media}
        </span>
        <span className="mt-0.5 text-[11px] font-bold tracking-wide" style={{ color: tier.subText }}>
          {posicion}
        </span>

        <div className="my-3">
          <Avatar src={avatar} alt={nombre} size={mini ? 56 : 72} />
        </div>

        <p
          className="text-center text-sm font-extrabold leading-tight line-clamp-2 px-1"
          style={{ color: tier.textColor }}
        >
          {nombre}
        </p>

        {nivel ? (
          <p className="mt-0.5 text-[10px] font-semibold opacity-80" style={{ color: tier.subText }}>
            Nivel {nivel}
          </p>
        ) : null}

        {!mini && attrs.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5 w-full pb-3">
            {attrs.map((a) => (
              <div key={a.label} className="flex items-center justify-center gap-1">
                <span className="text-xs font-black" style={{ color: tier.textColor }}>
                  {a.value ?? "-"}
                </span>
                <span className="text-[10px] font-semibold opacity-70" style={{ color: tier.subText }}>
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative mt-3 py-1.5 text-center text-[11px] font-bold tracking-[0.15em]"
        style={{ background: tier.barBg, color: tier.subText }}
      >
        {tier.label}
      </div>
    </div>
  );
}