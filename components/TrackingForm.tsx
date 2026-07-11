'use client';

import { useState } from 'react';
import api from '../lib/api';
import { 
  Search, 
  X,
  ArrowRight,
  Loader2
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
        'Error: No se encontró información. Verifique el formato e intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Indicador de Riesgo / Alerta (Rojo, Amarillo, Verde clásico de Windows 95)
  const getRiskStatus = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-red-600 border border-black inline-block shadow-inner"></span>
            <span className="font-bold text-red-700 uppercase">[ALERTA ALTA]</span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-yellow-400 border border-black inline-block shadow-inner"></span>
            <span className="font-bold text-yellow-600 uppercase">[RIESGO MEDIO]</span>
          </div>
        );
      case 'LOW':
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-green-600 border border-black inline-block shadow-inner"></span>
            <span className="font-bold text-green-700 uppercase">[RIESGO BAJO]</span>
          </div>
        );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CUSTOMS_RELEASED': return 'Aduana Liberado';
      case 'IN_TRANSIT': return 'En Tránsito';
      case 'DELAY_IN_PORT': return 'Demora Puerto';
      case 'PORT_OF_ORIGIN': return 'Puerto de Salida';
      case 'PORT_OF_DESTINATION': return 'Llegada a Puerto';
      case 'DELIVERED': return 'Entregado';
      default: return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-[#c0c0c0] text-black font-sans select-none border-2 border-t-white border-l-white border-b-black border-r-black">
      
      {/* WINDOW 1: Formulario de búsqueda (Retro Style) */}
      <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] mb-6 shadow-md">
        {/* Title Bar */}
        <div className="bg-[#000080] text-white font-bold text-xs px-2 py-1 flex items-center justify-between">
          <span className="tracking-wide">SPBoxCR - Rastreo de Contenedores v1.0</span>
          <button className="bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-black border-r-black h-4 w-4 flex items-center justify-center text-[9px] font-bold pb-0.5 active:border-t-black active:border-l-black active:border-b-white active:border-r-white">
            x
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-xs font-semibold text-black">
            Ingrese el número de contenedor (e.g. MEDU9837462) para iniciar el rastreo satelital.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            {/* Recessed Input Box */}
            <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-1">
              <input
                type="text"
                required
                className="w-full px-2 py-1.5 text-xs text-black font-mono focus:outline-none uppercase bg-white"
                placeholder="Nº DE CONTENEDOR"
                value={containerNumber}
                onChange={(e) => setContainerNumber(e.target.value)}
              />
            </div>
            {/* 3D Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c0c0c0] text-black font-bold text-xs px-6 py-2 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span className="font-bold">Buscar</span>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 text-xs text-red-800 font-mono">
              [ERROR] {error}
            </div>
          )}
        </div>
      </div>

      {/* WINDOW 2: Resultados consolidados */}
      {result && (
        <div className="space-y-6">
          
          {/* WINDOW 2A: Ficha de Especificaciones & Timeline (Historial de Ruta) */}
          <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-md">
            <div className="bg-[#000080] text-white font-bold text-xs px-2 py-1 flex items-center justify-between">
              <span className="tracking-wide">Detalle de Contenedor & Historial de Ruta</span>
              <span className="text-[10px] uppercase font-mono">Contenedor: {result.containerNumber}</span>
            </div>

            <div className="p-4 space-y-6">
              {/* Resumen General en Panel 3D Inset */}
              <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 font-bold">Línea Naviera:</span>
                  <p className="text-black font-bold mt-0.5">{result.carrier || 'Generic'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Estado Actual:</span>
                  <p className="text-black font-bold mt-0.5">{getStatusText(result.status)}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Estatus Alerta:</span>
                  <div className="mt-0.5">{getRiskStatus(result.riskLevel)}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">ETA Estimado:</span>
                  <p className="text-black font-bold mt-0.5">
                    {result.eta ? new Date(result.eta).toLocaleDateString('es-CR') : '-'}
                  </p>
                </div>
              </div>

              {/* Ficha Técnica (Specs) */}
              {result.specs && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                    Especificaciones Técnicas del Equipo:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                    <div className="bg-[#c0c0c0] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2">
                      <span className="text-slate-600 block text-[9px] font-bold uppercase">Tipo</span>
                      <span className="text-black font-bold">{result.specs.type}</span>
                    </div>
                    <div className="bg-[#c0c0c0] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2 sm:col-span-1">
                      <span className="text-slate-600 block text-[9px] font-bold uppercase">Dimensiones</span>
                      <span className="text-black font-bold">{result.specs.dimension}</span>
                    </div>
                    <div className="bg-[#c0c0c0] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2">
                      <span className="text-slate-600 block text-[9px] font-bold uppercase">Tara</span>
                      <span className="text-black font-bold">{result.specs.tare}</span>
                    </div>
                    <div className="bg-[#c0c0c0] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2">
                      <span className="text-slate-600 block text-[9px] font-bold uppercase">Carga Máxima</span>
                      <span className="text-black font-bold">{result.specs.maxPayload}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Table */}
              {result.timeline && result.timeline.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                    Bitácora de Eventos de Tránsito y Transbordos:
                  </h3>
                  
                  {/* Recessed Area containing the Windows 95 table */}
                  <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-mono min-w-[600px]">
                      <thead>
                        <tr className="bg-[#c0c0c0] border-b border-black text-black text-[10px] font-bold">
                          <th className="py-1 px-2 border-r border-[#808080] shadow-[inset_1px_1px_0px_white]">Estado/Hito</th>
                          <th className="py-1 px-2 border-r border-[#808080] shadow-[inset_1px_1px_0px_white]">Puerto / Locación</th>
                          <th className="py-1 px-2 border-r border-[#808080] shadow-[inset_1px_1px_0px_white]">Fecha</th>
                          <th className="py-1 px-2 border-r border-[#808080] shadow-[inset_1px_1px_0px_white]">Hora</th>
                          <th className="py-1 px-2 border-r border-[#808080] shadow-[inset_1px_1px_0px_white]">Medio / Buque</th>
                          <th className="py-1 px-2 shadow-[inset_1px_1px_0px_white] text-center">Viaje</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e0e0]">
                        {result.timeline.map((evt: any, idx: number) => (
                          <tr 
                            key={idx} 
                            className={`hover:bg-[#f0f0f0] ${
                              evt.completed ? 'text-black font-semibold' : 'text-slate-400 italic'
                            }`}
                          >
                            <td className="py-1.5 px-2 flex items-center gap-1.5">
                              <span className={`inline-block h-3.5 w-3.5 border border-black ${
                                evt.completed ? 'bg-green-600' : 'bg-slate-300'
                              }`}></span>
                              {evt.status}
                            </td>
                            <td className="py-1.5 px-2">{evt.place}</td>
                            <td className="py-1.5 px-2">
                              {evt.date ? new Date(evt.date).toLocaleDateString('es-CR') : '-'}
                            </td>
                            <td className="py-1.5 px-2">{evt.time}</td>
                            <td className="py-1.5 px-2">{evt.transport}</td>
                            <td className="py-1.5 px-2 text-center">{evt.voyage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WINDOW 2B: Asesoría Logística de IA (MOSTRADO DESPUÉS DEL TIMELINE) */}
          <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-md">
            <div className="bg-[#000080] text-white font-bold text-xs px-2 py-1 flex items-center justify-between">
              <span className="tracking-wide">Asesoría de Inteligencia Artificial Logística</span>
              <span className="text-[10px] font-mono">Status: OK</span>
            </div>

            <div className="p-4 space-y-4">
              {/* Alerta textual en Inset Box */}
              <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-3 text-xs leading-relaxed font-sans text-black">
                <p className="font-bold text-[#000080] mb-1 font-mono">&gt; DIAGNÓSTICO DEL ASESOR:</p>
                <p className="italic">"{result.advisorAlert || 'Cargando diagnóstico de precisión...'}"</p>
              </div>

              {/* Recomendaciones específicas */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold font-mono uppercase text-black">&gt; ACCIONES LOGÍSTICAS RECOMENDADAS:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.recommendations.map((rec: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-2.5 text-[11px] leading-relaxed text-slate-800 flex gap-2 items-start"
                      >
                        <span className="text-[#000080] font-bold">✔</span>
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
