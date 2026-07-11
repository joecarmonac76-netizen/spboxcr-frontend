'use client';

import { useState } from 'react';
import api from '../lib/api';
import { 
  Search, 
  Ship, 
  ArrowRight, 
  Cpu, 
  Loader2,
  Box,
  Truck,
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
        'No se encontró información para el contenedor provisto. Por favor, verifique el código.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (transport: string) => {
    if (!transport) return <Box className="h-4 w-4 text-slate-400" />;
    const t = transport.toLowerCase();
    if (t.includes('vessel') || t.includes('ship') || t.includes('barco')) {
      return <Ship className="h-4 w-4 text-[#0071e3]" />;
    }
    if (t.includes('truck') || t.includes('camion') || t.includes('terrestre')) {
      return <Truck className="h-4 w-4 text-[#34c759]" />;
    }
    return <Box className="h-4 w-4 text-slate-400" />;
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#ff3b30]/10 text-[#ff3b30] border border-[#ff3b30]/20">Riesgo Alto</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/20">Riesgo Medio</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">Riesgo Bajo</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CUSTOMS_RELEASED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#34c759]/10 text-[#34c759]">Aduana Liberado</span>;
      case 'IN_TRANSIT':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#0071e3]/10 text-[#0071e3]">En Tránsito</span>;
      case 'DELAY_IN_PORT':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#ff3b30]/10 text-[#ff3b30]">Demora Puerto</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">{status.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      
      {/* TARJETA DE BÚSQUEDA (Sleek macOS Window) */}
      <div className="max-w-lg mx-auto bg-white border border-[#d2d2d7]/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* macOS Window Controls */}
        <div className="bg-[#f5f5f7] px-4 py-3 flex items-center gap-1.5 border-b border-[#e5e5ea]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="h-3 w-3 rounded-full bg-[#27c93f]"></span>
          <span className="text-[11px] font-semibold text-slate-500 ml-2 tracking-wide font-sans">
            SPBoxCR - Rastreo de Carga
          </span>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-800">
            Ingrese el número de contenedor o BL para comenzar el rastreo.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              className="flex-grow px-4 py-2.5 bg-[#f5f5f7] border border-[#d2d2d7] text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm uppercase"
              placeholder="Ej: MEDU9837462"
              value={containerNumber}
              onChange={(e) => setContainerNumber(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#0071e3] text-white font-semibold rounded-xl hover:bg-[#0077ed] transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm shadow-[#0071e3]/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* RESULTADOS DE BÚSQUEDA */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* WINDOW 1: Ficha Técnica e Historial (Timeline) */}
          <div className="bg-white border border-[#d2d2d7]/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Window Header */}
            <div className="bg-[#f5f5f7] px-4 py-3 flex items-center gap-1.5 border-b border-[#e5e5ea] justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
                <span className="h-3 w-3 rounded-full bg-[#27c93f]"></span>
                <span className="text-[11px] font-semibold text-slate-800 ml-2">
                  Detalle del Envío y Movimientos
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                {result.containerNumber}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumen macOS Style Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Línea Naviera</p>
                  <p className="text-sm font-bold text-[#1d1d1f] mt-1">{result.carrier || 'Generic Carrier'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estatus Actual</p>
                  <div className="mt-1">{getStatusBadge(result.status)}</div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Evaluación Riesgo</p>
                  <div className="mt-1">{getRiskBadge(result.riskLevel)}</div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ETA Estimado</p>
                  <p className="text-sm font-bold text-[#1d1d1f] mt-1">
                    {result.eta ? new Date(result.eta).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>

              {/* Ficha Técnica (Specs) */}
              {result.specs && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Box className="h-4 w-4 text-[#0071e3]" />
                    Especificaciones del Contenedor:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Tipo</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{result.specs.type}</p>
                    </div>
                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Dimensiones</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{result.specs.dimension}</p>
                    </div>
                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Tara</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{result.specs.tare}</p>
                    </div>
                    <div className="p-3 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea]">
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">Carga Máxima</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{result.specs.maxPayload}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bitácora de Eventos (Timeline) */}
              {result.timeline && result.timeline.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-[#0071e3]" />
                    Bitácora de Tránsito y Transbordos:
                  </h4>

                  {/* Vista Tabla Desktop */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-[#e5e5ea] bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#e5e5ea] bg-[#f5f5f7] text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-2.5 px-4">Estado / Hito</th>
                          <th className="py-2.5 px-4">Ubicación</th>
                          <th className="py-2.5 px-4">Fecha</th>
                          <th className="py-2.5 px-4">Hora</th>
                          <th className="py-2.5 px-4">Transporte</th>
                          <th className="py-2.5 px-4 text-center">Viaje</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e5ea] text-slate-700">
                        {result.timeline.map((evt: any, index: number) => (
                          <tr 
                            key={index} 
                            className={`hover:bg-slate-50/50 transition-all ${
                              evt.completed ? 'text-slate-900 font-semibold' : 'text-slate-400 italic'
                            }`}
                          >
                            <td className="py-2.5 px-4 flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${
                                evt.completed ? 'bg-[#34c759]' : 'bg-slate-300'
                              }`}></span>
                              {evt.status}
                            </td>
                            <td className="py-2.5 px-4">{evt.place}</td>
                            <td className="py-2.5 px-4">
                              {evt.date ? new Date(evt.date).toLocaleDateString('es-CR') : '-'}
                            </td>
                            <td className="py-2.5 px-4">{evt.time}</td>
                            <td className="py-2.5 px-4 flex items-center gap-1.5">
                              {getTransportIcon(evt.transport)}
                              <span>{evt.transport}</span>
                            </td>
                            <td className="py-2.5 px-4 text-center">{evt.voyage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vista Tarjetas Mobile */}
                  <div className="grid grid-cols-1 gap-3 md:hidden">
                    {result.timeline.map((evt: any, index: number) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                          evt.completed 
                            ? 'bg-white border-[#d2d2d7] text-slate-800 shadow-sm' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-400 italic'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${
                              evt.completed ? 'bg-[#34c759]' : 'bg-slate-300'
                            }`}></span>
                            <span className="text-xs font-bold uppercase">{evt.status}</span>
                          </div>
                          {evt.completed && (
                            <span className="text-[9px] bg-[#34c759]/10 text-[#34c759] px-1.5 py-0.5 rounded-full font-bold">
                              Listo
                            </span>
                          )}
                        </div>

                        <div className="text-xs grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Lugar</span>
                            <p className="font-semibold text-slate-850">{evt.place}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Fecha</span>
                            <p className="font-semibold text-slate-850">
                              {evt.date ? new Date(evt.date).toLocaleDateString('es-CR') : '-'}
                            </p>
                          </div>
                          <div className="col-span-2 flex items-center justify-between border-t border-slate-50 pt-1.5 mt-1">
                            <div className="flex items-center gap-1">
                              {getTransportIcon(evt.transport)}
                              <span className="text-[10px]">{evt.transport}</span>
                            </div>
                            <span className="text-[10px] font-mono">Viaje: {evt.voyage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WINDOW 2: Asesoría de IA (RENDERED AFTER TIMELINE) */}
          <div className="bg-white border border-[#d2d2d7]/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Window Header */}
            <div className="bg-[#f5f5f7] px-4 py-3 flex items-center gap-1.5 border-b border-[#e5e5ea]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
              <span className="h-3 w-3 rounded-full bg-[#27c93f]"></span>
              <span className="text-[11px] font-semibold text-[#0071e3] ml-2 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-[#0071e3]" />
                Diagnóstico Asesor de IA
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-slate-800 text-sm leading-relaxed italic">
                "{result.advisorAlert || 'Analizando contenedor...'}"
              </div>

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones Recomendadas:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-[#f5f5f7] border border-[#e5e5ea] rounded-xl text-xs text-slate-700 flex gap-2 items-start"
                      >
                        <span className="text-[#0071e3] font-bold">✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
