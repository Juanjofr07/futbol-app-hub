"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  // modos: "registro" | "ingreso" | "recuperar"
  const [modo, setModo] = useState("registro");
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    clave: "",
    claveConfirm: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("neutral"); // "neutral" | "ok" | "error"
  const [cargando, setCargando] = useState(false);

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function mostrarMensaje(texto, tipo = "neutral") {
    setMensaje(texto);
    setMensajeTipo(tipo);
  }

  async function enviar() {
    if (!supabase) {
      mostrarMensaje("Falta conectar Supabase (revisa .env.local).", "error");
      return;
    }

    // ── Recuperar contraseña ──────────────────────────────────────────────
    if (modo === "recuperar") {
      if (!form.correo) {
        mostrarMensaje("Ingresa tu correo para continuar.", "error");
        return;
      }
      setCargando(true);
      mostrarMensaje("");
      const { error } = await supabase.auth.resetPasswordForEmail(form.correo, {
        redirectTo: `${window.location.origin}/actualizar-clave`,
      });
      setCargando(false);
      if (error) {
        mostrarMensaje(error.message, "error");
      } else {
        mostrarMensaje(
          "📩 Te enviamos un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.",
          "ok"
        );
      }
      return;
    }

    // ── Registro ──────────────────────────────────────────────────────────
    if (modo === "registro") {
      if (!form.nombre || !form.correo || !form.clave) {
        mostrarMensaje("Por favor completa todos los campos.", "error");
        return;
      }
      if (form.clave !== form.claveConfirm) {
        mostrarMensaje("Las contraseñas no coinciden.", "error");
        return;
      }
      if (form.clave.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
      }

      setCargando(true);
      mostrarMensaje("");
      const { data, error } = await supabase.auth.signUp({
        email: form.correo,
        password: form.clave,
        options: {
          data: {
            nombre: form.nombre,
            telefono: form.telefono,
          },
        },
      });
      setCargando(false);

      if (error) {
        mostrarMensaje(error.message, "error");
      } else if (data.user) {
        mostrarMensaje("✅ Cuenta creada con éxito.", "ok");
        router.push("/");
        router.refresh();
      }
      return;
    }

    // ── Ingreso ───────────────────────────────────────────────────────────
    setCargando(true);
    mostrarMensaje("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.correo,
      password: form.clave,
    });
    setCargando(false);

    if (error) {
      mostrarMensaje(error.message, "error");
    } else {
      mostrarMensaje("✅ Ingresaste correctamente.", "ok");
      router.push("/");
      router.refresh();
    }
  }

  // Colores del mensaje según tipo
  const mensajeColor =
    mensajeTipo === "ok"
      ? "text-green-700"
      : mensajeTipo === "error"
      ? "text-red-600"
      : "text-gray-600";

  const titulo =
    modo === "registro"
      ? "Crear cuenta"
      : modo === "ingreso"
      ? "Ingresar"
      : "Recuperar contraseña";

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{titulo}</h1>

      {/* ── Campos de registro ─────────────────────────────────────────── */}
      {modo === "registro" && (
        <>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => actualizar("nombre", e.target.value)}
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => actualizar("telefono", e.target.value)}
          />
        </>
      )}

      {/* ── Correo (siempre visible) ────────────────────────────────────── */}
      <input
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        placeholder="Correo"
        type="email"
        value={form.correo}
        onChange={(e) => actualizar("correo", e.target.value)}
      />

      {/* ── Contraseña (oculta en modo recuperar) ──────────────────────── */}
      {modo !== "recuperar" && (
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          placeholder="Contraseña"
          type="password"
          value={form.clave}
          onChange={(e) => actualizar("clave", e.target.value)}
        />
      )}

      {/* ── Confirmar contraseña (solo en registro) ─────────────────────── */}
      {modo === "registro" && (
        <input
          className={`border rounded-lg px-3 py-2 text-sm ${
            form.claveConfirm && form.clave !== form.claveConfirm
              ? "border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
              : "border-gray-300"
          }`}
          placeholder="Confirmar contraseña"
          type="password"
          value={form.claveConfirm}
          onChange={(e) => actualizar("claveConfirm", e.target.value)}
        />
      )}
      {modo === "registro" &&
        form.claveConfirm &&
        form.clave !== form.claveConfirm && (
          <p className="text-xs text-red-500 -mt-2">
            Las contraseñas no coinciden.
          </p>
        )}

      {/* ── Botón principal ─────────────────────────────────────────────── */}
      <button
        disabled={cargando}
        onClick={enviar}
        className="bg-cancha-verde text-white rounded-lg py-2 text-sm font-medium hover:bg-cancha-verdeoscuro disabled:opacity-60"
      >
        {cargando
          ? "Un momento..."
          : modo === "registro"
          ? "Crear cuenta"
          : modo === "ingreso"
          ? "Ingresar"
          : "Enviar correo de recuperación"}
      </button>

      {/* ── Enlace ¿Olvidaste tu contraseña? (solo en ingreso) ──────────── */}
      {modo === "ingreso" && (
        <button
          onClick={() => {
            setModo("recuperar");
            mostrarMensaje("");
          }}
          className="text-xs text-cancha-verde underline text-left"
        >
          ¿Olvidaste tu contraseña?
        </button>
      )}

      {/* ── Cambio de modo ──────────────────────────────────────────────── */}
      <button
        onClick={() => {
          setModo(modo === "registro" ? "ingreso" : "registro");
          mostrarMensaje("");
        }}
        className="text-xs text-gray-500 underline"
      >
        {modo === "registro"
          ? "Ya tengo cuenta → Ingresar"
          : modo === "ingreso"
          ? "Crear una cuenta nueva"
          : "Volver al inicio de sesión"}
      </button>

      {/* ── Mensaje de estado ───────────────────────────────────────────── */}
      {mensaje && <p className={`text-xs ${mensajeColor}`}>{mensaje}</p>}
    </div>
  );
}
