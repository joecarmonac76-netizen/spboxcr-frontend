import TrackingForm from '../components/TrackingForm';
import { Ship, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Elementos Decorativos de Fondo (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-600/30">
            <Ship className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white bg-clip-text">
            SPBOX<span className="text-indigo-500">CR</span>
          </span>
        </div>

        <Link 
          href="/admin" 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-300"
        >
          <Lock className="h-3 w-3" />
          Acceso Admin
        </Link>
      </header>

      {/* Hero & Tracking Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 z-10">
        <div className="text-center max-w-lg px-4 mb-8 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Control Logístico de Precisión
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Consulte en tiempo real el estatus de sus contenedores con el respaldo y análisis de nuestro Asesor Logístico de IA.
          </p>
        </div>

        <TrackingForm />
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-slate-900 z-10 text-center">
        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} SPBoxCR. Todos los derechos reservados. Optimizado para dispositivos móviles.
        </p>
      </footer>
    </main>
  );
}
