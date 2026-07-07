'use client';

import { useState } from 'react';
import { 
  Ship, 
  ArrowLeft, 
  Plus, 
  Bell, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter 
} from 'lucide-react';
import Link from 'next/link';

// Mock de contenedores activos para visualización rápida del administrador
const INITIAL_CONTAINERS = [
  { id: '1', number: 'MSKU8726351', carrier: 'Maersk', status: 'IN_TRANSIT', eta: '2026-07-15T00:00:00Z', risk: 'MEDIUM' },
  { id: '2', number: 'MEDU9837462', carrier: 'MSC', status: 'PORT_OF_DESTINATION', eta: '2026-07-09T00:00:00Z', risk: 'LOW' },
  { id: '3', number: 'HLCU1294837', carrier: 'Hapag-Lloyd', status: 'CUSTOMS_RELEASED', eta: '2026-07-07T00:00:00Z', risk: 'LOW' },
  { id: '4', number: 'COSU6354728', carrier: 'COSCO', status: 'DELAY_IN_PORT', eta: '2026-07-22T00:00:00Z', risk: 'HIGH' },
];

export default function AdminDashboard() {
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [filter, setFilter] = useState('ALL');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CUSTOMS_RELEASED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Aduana Liberado</span>;
      case 'IN_TRANSIT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">En Tránsito</span>;
      case 'DELAY_IN_PORT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">Demora Puerto</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  const getRiskIndicator = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <div className="h-2 w-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></div>;
      case 'MEDIUM':
        return <div className="h-2 w-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>;
    }
  };

  const handleNotify = (containerNumber: string) => {
    alert(`Notificación enviada al cliente responsable del contenedor ${containerNumber}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-all">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">
                SPBOX<span className="text-indigo-500">CR</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Contenedor</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Monitoreo General de Cargas</h1>
            <p className="text-xs text-slate-400 mt-1">Gestione, edite y notifique alertas de todos los contenedores logísticos.</p>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex gap-1">
              {['ALL', 'IN_TRANSIT', 'DELAY_IN_PORT'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    filter === opt 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {opt === 'ALL' ? 'Todos' : opt === 'IN_TRANSIT' ? 'En Tránsito' : 'Demora'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenedores (Mobile View: Cards) */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {containers
            .filter((c) => filter === 'ALL' || c.status === filter)
            .map((c) => (
              <div key={c.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskIndicator(c.risk)}
                    <span className="font-bold text-white tracking-wide">{c.number}</span>
                  </div>
                  <span className="text-xs text-slate-500">{c.carrier}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 font-semibold">Estado</p>
                    {getStatusBadge(c.status)}
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-xs text-slate-500 font-semibold">ETA Estimado</p>
                    <p className="text-slate-300 font-medium">
                      {new Date(c.eta).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <button 
                    onClick={() => handleNotify(c.number)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Notificar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all">
                    <Edit3 className="h-3.5 w-3.5" />
                    Editar
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Contenedores (Desktop View: Table) */}
        <div className="hidden sm:block overflow-hidden bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Contenedor</th>
                <th className="py-4 px-6">Naviera</th>
                <th className="py-4 px-6">Estatus</th>
                <th className="py-4 px-6">ETA Estimado</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
              {containers
                .filter((c) => filter === 'ALL' || c.status === filter)
                .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/20 transition-all duration-150">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        {getRiskIndicator(c.risk)}
                        {c.number}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">{c.carrier}</td>
                    <td className="py-4 px-6">{getStatusBadge(c.status)}</td>
                    <td className="py-4 px-6 font-medium">
                      {new Date(c.eta).toLocaleDateString('es-CR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleNotify(c.number)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                          title="Enviar Notificación"
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                          title="Editar Registro"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
