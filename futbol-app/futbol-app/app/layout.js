import './globals.css';
import Navbar from '../components/Navbar';
import { SportProvider } from '../lib/SportContext';

export const metadata = {
  title: 'Sports Hub | Fútbol & Pádel',
  description:
    'Una sola cuenta para jugar fútbol, pádel y más deportes en un solo lugar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
        {/* SportProvider envuelve toda la app para que Navbar y páginas lean el deporte activo */}
        <SportProvider>
          <Navbar />
          <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
            {children}
          </main>
        </SportProvider>
      </body>
    </html>
  );
}
