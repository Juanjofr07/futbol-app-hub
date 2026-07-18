export const LOGROS_CATALOGO = [
  {
    id: "primer_partido",
    label: "Primer partido",
    desc: "Jugaste tu primer partido",
    check: (p) => (p.partidos_jugados ?? 0) >= 1,
  },
  {
    id: "regular",
    label: "Regular",
    desc: "5 partidos jugados",
    check: (p) => (p.partidos_jugados ?? 0) >= 5,
  },
  {
    id: "veterano",
    label: "Veterano",
    desc: "10 partidos jugados",
    check: (p) => (p.partidos_jugados ?? 0) >= 10,
  },
  {
    id: "goleador",
    label: "Goleador",
    desc: "5 goles marcados",
    check: (p) => (p.goles_total ?? 0) >= 5,
  },
  {
    id: "cazagoles",
    label: "Cazagoles",
    desc: "15 goles marcados",
    check: (p) => (p.goles_total ?? 0) >= 15,
  },
  {
    id: "asistente",
    label: "Asistente",
    desc: "5 asistencias",
    check: (p) => (p.asistencias_total ?? 0) >= 5,
  },
  {
    id: "nivel_5",
    label: "Nivel 5",
    desc: "Alcanzó el nivel 5",
    check: (p) => (p.nivel ?? 1) >= 5,
  },
  {
    id: "elite",
    label: "Élite",
    desc: "Media general de 80 o más",
    check: (p) => (p.media_general ?? 0) >= 80,
  },
];

export function calcularLogros(perfil) {
  return LOGROS_CATALOGO.map((l) => ({ ...l, desbloqueado: l.check(perfil) }));
}