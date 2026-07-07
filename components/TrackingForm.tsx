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
        'No se encontró información para el código provisto. Verifique el número de contenedor (ej: MSKU1234567).'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case 'CUSTOMS_RELEASED':
        return <CheckCircle className="h-6 w-6 text-teal-400" />;
      case 'PORT_OF_DESTINATION':
        return <MapPin className="h-6 w-6 text-sky-400" />;
      case 'IN_TRANSIT':
        return <Ship className="h-6 w-6 text-indigo-400" />;
      default:
        return <Ship className="h-6 w-6 text-indigo-400" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Riesgo Alto</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Riesgo Medio</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Riesgo Bajo</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">Riesgo Normal</span>;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Tarjeta de Consulta */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Ship className="h-5 w-5 text-indigo-500" />
          Rastreo de Carga
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
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center"
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

      {/* Tarjeta de Resultados */}
      {result && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Ficha de Estado General */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Contenedor</p>
                <p className="text-lg font-bold text-white tracking-wide">{result.containerNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Naviera</p>
                <p className="text-sm font-medium text-slate-300">{result.carrier}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                {getStatusIcon(result.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-white uppercase tracking-wide">
                    {result.status.replace(/_/g, ' ')}
                  </p>
                  {getRiskBadge(result.riskLevel)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Último evento registrado: {result.lastEvent.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Ubicación</span>
                </div>
                <p className="font-semibold text-slate-200">{result.lastEvent.location}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">ETA Estimado</span>
                </div>
                <p className="font-semibold text-slate-200">
                  {new Date(result.eta).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Ficha de Asesoría de IA (Asesor Logístico Senior) */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-indigo-500/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Fondo decorativo glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 animate-pulse" />
              Asesores Logísticos SPBoxCR (IA)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-indigo-500/10">
              "{result.advisorAlert}"
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-indigo-400/80 uppercase tracking-wider">Recomendaciones Clave:</p>
              <ul className="space-y-2">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-xs text-slate-400 flex items-start gap-2">
                    <ArrowRight className="h-3 w-3 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
