import TrackingForm from '../components/TrackingForm';
import { Ship, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Soft macOS style blurred color overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0071e3]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#34c759]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#0071e3] p-2 rounded-xl text-white shadow-sm shadow-[#0071e3]/20">
            <Ship className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#1d1d1f]">
            SPBOX<span className="text-[#0071e3]">CR</span>
          </span>
        </div>

        <Link 
          href="/admin" 
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-full hover:bg-[#f5f5f7] active:bg-[#e8e8ed] transition-all duration-200 shadow-sm"
        >
          <Lock className="h-3 w-3 text-slate-500" />
          Acceso Administrador
        </Link>
      </header>

      {/* Hero & Tracking Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 z-10">
        <div className="text-center max-w-lg px-4 mb-8 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl md:text-5xl">
            Control Logístico de Precisión
          </h1>
          <p className="text-sm text-[#86868b] max-w-md mx-auto leading-relaxed">
            Consulte en tiempo real el estatus de sus contenedores con el respaldo y análisis de nuestro Asesor Logístico de IA.
          </p>
        </div>

        <TrackingForm />
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-[#d2d2d7]/50 z-10 text-center">
        <p className="text-xs text-[#86868b]">
          &copy; {new Date().getFullYear()} SPBoxCR. Todos los derechos reservados. Diseñado al estilo macOS.
        </p>
      </footer>
    </main>
  );
}
