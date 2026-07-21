"use client";

import Link from "next/link";

export default function HubHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">¿Qué quieres jugar hoy?</h1>

      <p className="mb-4 text-sm text-gray-300">
        Usa la misma cuenta para todos los deportes del hub.
      </p>

      <div className="flex gap-4">
        <Link
          href="/futbol"
          className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700"
        >
          Fútbol
        </Link>

        <Link
          href="/padel"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          Pádel
        </Link>
      </div>
    </main>
  );
}
