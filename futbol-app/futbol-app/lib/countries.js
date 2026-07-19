export const COUNTRIES = [
  { code: "VE", name: "Venezuela" },
  { code: "CO", name: "Colombia" },
  { code: "AR", name: "Argentina" },
  { code: "BR", name: "Brasil" },
  { code: "MX", name: "México" },
  { code: "ES", name: "España" },
  { code: "US", name: "Estados Unidos" },
  { code: "PE", name: "Perú" },
  { code: "CL", name: "Chile" },
  { code: "EC", name: "Ecuador" },
  { code: "PA", name: "Panamá" },
  { code: "DO", name: "República Dominicana" },
  { code: "UY", name: "Uruguay" },
  { code: "PY", name: "Paraguay" },
  { code: "BO", name: "Bolivia" },
  { code: "CR", name: "Costa Rica" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "NI", name: "Nicaragua" },
  { code: "SV", name: "El Salvador" },
  { code: "CU", name: "Cuba" },
  { code: "PR", name: "Puerto Rico" },
  { code: "IT", name: "Italia" },
  { code: "PT", name: "Portugal" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Alemania" },
  { code: "GB", name: "Reino Unido" },
];

export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}