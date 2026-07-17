import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseNumber(value) {
  if (!value) return null;
  const cleaned = value.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  try {
    const response = await fetch("https://www.bcv.org.ve/", {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudo consultar la página del BCV.", status: response.status },
        { status: 500 }
      );
    }

    const html = await response.text();

    const usdSection =
      html.match(/USD[\s\S]{0,800}?([\d.,]+)</i) ||
      html.match(/Dólar[\s\S]{0,800}?([\d.,]+)</i) ||
      html.match(/Dolar[\s\S]{0,800}?([\d.,]+)</i);

    const fechaMatch =
      html.match(/Fecha Valor:\s*([^<\n]+)/i) ||
      html.match(/Fecha de Valor:\s*([^<\n]+)/i);

    const usdRate = parseNumber(usdSection?.[1]);
    const fechaValor = fechaMatch?.[1]?.trim() || "";

    if (!usdRate) {
      return NextResponse.json(
        {
          error: "No se pudo extraer la tasa USD del BCV.",
          debug: {
            foundUsdSection: Boolean(usdSection),
            foundFecha: Boolean(fechaMatch),
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      usdRate,
      fechaValor,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ocurrió un error consultando la tasa BCV." },
      { status: 500 }
    );
  }
}
