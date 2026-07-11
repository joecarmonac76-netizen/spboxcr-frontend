'use client';

import { useState } from 'react';
import api from '../lib/api';
import { 
  Search, 
  Ship, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Cpu, 
  Loader2,
  Box,
  Anchor,
  Truck,
  Layers,
  Compass
} from 'lucide-react';

export default function TrackingForm() {
  const [containerNumber, setContainerNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!containerNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.get(`/api/tracking/${containerNumber.trim().toUpperCase()}`);
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(
        'No se encontró información para el código provisto. Verifique el número de contenedor (ej: MSKU1234567).'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (transport: string) => {
    const t = transport.toLowerCase();
    if (t.includes('vessel') || t.includes('ship') || t.includes('barco')) {
      return <Ship className="h-4 w-4 text-indigo-400" />;
    }
    if (t.includes('truck') || t.includes('camion') || t.includes('terrestre')) {
      return <Truck className="h-4 w-4 text-emerald-400" />;
    }
    return <Box className="h-4 w-4 text-slate-400" />;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">Riesgo Alto</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Riesgo Medio</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Riesgo Bajo</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">Riesgo Normal</span>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      {/* Tarjeta de Consulta */}
      <div className="max-w-lg mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Ship className="h-5 w-5 text-indigo-500" />
          Rastreo de Carga Inteligente
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Ingrese el número de contenedor o BL de su envío para iniciar el seguimiento.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              required
              className="w-full pl-4 pr-12 py-3.5 bg-slate-950/80 border border-slate-800 text-white rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-base uppercase"
              placeholder="Ej: MSKU1234567"
              value={containerNumber}
              onChange={(e) => setContainerNumber(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>

        {/* Mensaje de Error Amigable */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex gap-3 animate-fadeIn">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Consulta Fallida</p>
              <p className="text-rose-300/85 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* RESULTADOS ENRIQUECIDOS */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Fila superior: Resumen rápido y Alerta de IA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Datos del Contenedor */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-400 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Contenedor Activo
                </span>
                <h3 className="text-2xl font-black text-white mt-2 tracking-wide uppercase">{result.containerNumber}</h3>
                <p className="text-xs text-slate-500 mt-1">Línea Naviera: <span className="text-slate-300 font-semibold">{result.carrier}</span></p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Riesgo Operativo</p>
                  <div className="mt-1">{getRiskBadge(result.riskLevel)}</div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">ETA de arribo</p>
                  <p className="text-sm font-bold text-white mt-1">
                    {new Date(result.eta).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Asesoría de IA en tarjeta destacada */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Cpu className="h-4 w-4 animate-pulse text-indigo-400" />
                  Asesoría Logística Senior
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-950/40 p-4 rounded-xl border border-indigo-500/10">
                  "{result.advisorAlert}"
                </p>
              </div>

              <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
                {result.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex gap-2 items-start shrink-0 max-w-[240px] bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                    <ArrowRight className="h-3 w-3 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-400 leading-normal">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FICHA 2: Especificaciones del Contenedor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Box className="h-4 w-4 text-slate-500" />
              Información de Ficha Técnica (Container Specs)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Tipo</p>
                <p className="text-sm font-bold text-white mt-0.5">{result.specs.type}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 col-span-1 md:col-span-2">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Descripción del Equipo</p>
                <p className="text-sm font-bold text-white mt-0.5 truncate">{result.specs.description}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Tara (Tare)</p>
                <p className="text-sm font-bold text-white mt-0.5">{result.specs.tare}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Máx Carga Útil</p>
                <p className="text-sm font-bold text-white mt-0.5">{result.specs.maxPayload}</p>
              </div>
            </div>
          </div>

          {/* FICHA 3: Timeline e Historial de Movimientos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-slate-500" />
              Historial de Ruta & Transbordos (Timeline)
            </h4>

            {/* Vista Tabla para Desktop */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Estado / Hito</th>
                    <th className="py-3 px-4">Puerto / Locación</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Hora</th>
                    <th className="py-3 px-4">Transporte</th>
                    <th className="py-3 px-4 text-center">Viaje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                  {result.timeline.map((evt: any, index: number) => (
                    <tr 
                      key={index} 
                      className={`hover:bg-slate-900/10 transition-all ${
                        evt.completed ? 'text-slate-100 font-semibold' : 'text-slate-500 italic'
                      }`}
                    >
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          evt.completed ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-slate-700'
                        }`}></div>
                        {evt.status}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{evt.place}</td>
                      <td className="py-3.5 px-4">
                        {new Date(evt.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">{evt.time}</td>
                      <td className="py-3.5 px-4 flex items-center gap-1.5">
                        {getTransportIcon(evt.transport)}
                        <span>{evt.transport}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold">{evt.voyage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Tarjetas Compactas para Móvil */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {result.timeline.map((evt: any, index: number) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${
                    evt.completed 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-100' 
                      : 'bg-slate-950/20 border-slate-900/50 text-slate-600 italic'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        evt.completed ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}></div>
                      <span className="text-xs font-bold uppercase">{evt.status}</span>
                    </div>
                    {evt.completed && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold">
                        Realizado
                      </span>
                    )}
                  </div>

                  <div className="text-xs grid grid-cols-2 gap-y-2 gap-x-4 border-t border-slate-800/40 pt-2 text-slate-400">
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-semibold">Ubicación</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{evt.place}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-600 uppercase font-semibold">Fecha y Hora</p>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {new Date(evt.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })} a las {evt.time}
                      </p>
                    </div>
                    <div className="col-span-2 border-t border-slate-900/30 pt-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getTransportIcon(evt.transport)}
                        <span className="text-[10px]">{evt.transport}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold">Viaje: {evt.voyage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
