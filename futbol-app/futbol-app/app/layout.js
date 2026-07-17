import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Gol Caracas FC | Fútbol en Barquisimeto",
  description: "Únete a partidos de fútbol organizados en las mejores canchas de Barquisimeto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
