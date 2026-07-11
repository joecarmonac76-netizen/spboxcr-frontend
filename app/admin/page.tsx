'use client';

import { useState } from 'react';
import { 
  Ship, 
  ArrowLeft, 
  Plus, 
  Bell, 
  Edit3, 
  Filter, 
  X, 
  Save, 
  Mail, 
  MessageSquare, 
  Send,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

// Mock de contenedores activos inicial
const INITIAL_CONTAINERS = [
  { id: '1', number: 'MSKU8726351', carrier: 'Maersk', status: 'IN_TRANSIT', eta: '2026-07-15T00:00:00Z', risk: 'MEDIUM', clientName: 'Juan Pérez', clientPhone: '+506 8888-8888', clientEmail: 'juan@spboxcr.com' },
  { id: '2', number: 'MEDU9837462', carrier: 'MSC', status: 'PORT_OF_DESTINATION', eta: '2026-07-09T00:00:00Z', risk: 'LOW', clientName: 'María Bolaños', clientPhone: '+506 7777-7777', clientEmail: 'maria@spboxcr.com' },
  { id: '3', number: 'HLCU1294837', carrier: 'Hapag-Lloyd', status: 'CUSTOMS_RELEASED', eta: '2026-07-07T00:00:00Z', risk: 'LOW', clientName: 'Logística Tica S.A.', clientPhone: '+506 6666-6666', clientEmail: 'contacto@logistica.cr' },
  { id: '4', number: 'COSU6354728', carrier: 'COSCO', status: 'DELAY_IN_PORT', eta: '2026-07-22T00:00:00Z', risk: 'HIGH', clientName: 'Importaciones del Oeste', clientPhone: '+506 8545-2121', clientEmail: 'admin@oeste.cr' },
];

export default function AdminDashboard() {
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);
  const [filter, setFilter] = useState('ALL');

  // Estados de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  // Estados de formularios
  const [newContainer, setNewContainer] = useState({
    number: '',
    carrier: 'Maersk',
    status: 'IN_TRANSIT',
    eta: '',
    risk: 'LOW',
    clientName: '',
    clientPhone: '',
    clientEmail: ''
  });

  const [editingContainer, setEditingContainer] = useState<any>(null);
  const [notifyingContainer, setNotifyingContainer] = useState<any>(null);
  
  // Estado para la configuración de notificación
  const [notifyConfig, setNotifyConfig] = useState({
    channel: 'WHATSAPP', // 'WHATSAPP' | 'EMAIL'
    contactInfo: '',
    customMessage: ''
  });

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

  // AGREGAR CONTENEDOR
  const handleAddContainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContainer.number) return;

    const formattedETA = newContainer.eta ? new Date(newContainer.eta).toISOString() : new Date().toISOString();

    const created = {
      id: Date.now().toString(),
      number: newContainer.number.trim().toUpperCase(),
      carrier: newContainer.carrier,
      status: newContainer.status,
      eta: formattedETA,
      risk: newContainer.risk,
      clientName: newContainer.clientName || 'Cliente Genérico',
      clientPhone: newContainer.clientPhone || '+506 8888-8888',
      clientEmail: newContainer.clientEmail || 'cliente@spboxcr.com'
    };

    setContainers([created, ...containers]);
    setIsAddModalOpen(false);
    
    // Reset form
    setNewContainer({
      number: '',
      carrier: 'Maersk',
      status: 'IN_TRANSIT',
      eta: '',
      risk: 'LOW',
      clientName: '',
      clientPhone: '',
      clientEmail: ''
    });
  };

  // MANDAR A EDITAR
  const openEditModal = (container: any) => {
    setEditingContainer({
      ...container,
      eta: container.eta.split('T')[0] // Formato para el input de tipo date
    });
    setIsEditModalOpen(true);
  };

  // GUARDAR EDICION
  const handleEditContainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContainer.number) return;

    const formattedETA = new Date(editingContainer.eta).toISOString();

    setContainers(
      containers.map((c) =>
        c.id === editingContainer.id
          ? { ...editingContainer, eta: formattedETA }
          : c
      )
    );
    setIsEditModalOpen(false);
    setEditingContainer(null);
  };

  // ELIMINAR CONTENEDOR
  const handleDeleteContainer = (id: string) => {
    if (confirm('¿Está seguro de eliminar este contenedor de la lista?')) {
      setContainers(containers.filter((c) => c.id !== id));
      setIsEditModalOpen(false);
    }
  };

  // NOTIFICACIONES
  const openNotifyModal = (container: any) => {
    setNotifyingContainer(container);
    setNotifyConfig({
      channel: 'WHATSAPP',
      contactInfo: container.clientPhone,
      customMessage: `Estimado(a) ${container.clientName}, le informamos que su contenedor ${container.number} se encuentra en estado: "${container.status.replace(/_/g, ' ')}". ETA estimado: ${new Date(container.eta).toLocaleDateString('es-CR')}.`
    });
    setIsNotifyModalOpen(true);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `[SIMULACIÓN EXITOSA]\nNotificación enviada vía ${notifyConfig.channel} a ${notifyConfig.contactInfo}.\nMensaje: "${notifyConfig.customMessage}"`
    );
    setIsNotifyModalOpen(false);
    setNotifyingContainer(null);
  };

  const onChannelChange = (channel: string) => {
    if (!notifyingContainer) return;
    setNotifyConfig({
      ...notifyConfig,
      channel,
      contactInfo: channel === 'WHATSAPP' ? notifyingContainer.clientPhone : notifyingContainer.clientEmail
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-12 select-none relative">
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

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Contenedor</span>
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

                <div className="text-xs space-y-1 text-slate-400">
                  <p><span className="font-semibold text-slate-500">Cliente:</span> {c.clientName}</p>
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
                    onClick={() => openNotifyModal(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-300 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Notificar
                  </button>
                  <button 
                    onClick={() => openEditModal(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all cursor-pointer"
                  >
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
                <th className="py-4 px-6">Cliente</th>
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
                    <td className="py-4 px-6 text-slate-400">{c.clientName}</td>
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
                          onClick={() => openNotifyModal(c)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Enviar Notificación"
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all cursor-pointer"
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

      {/* MODAL 1: AÑADIR CONTENEDOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Ship className="h-5 w-5 text-indigo-500" />
              Agregar Nuevo Contenedor
            </h2>

            <form onSubmit={handleAddContainer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Nº de Contenedor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: MSKU1234567"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm uppercase"
                    value={newContainer.number}
                    onChange={(e) => setNewContainer({...newContainer, number: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Naviera (Carrier)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={newContainer.carrier}
                    onChange={(e) => setNewContainer({...newContainer, carrier: e.target.value})}
                  >
                    <option value="Maersk">Maersk</option>
                    <option value="MSC">MSC</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="COSCO">COSCO</option>
                    <option value="ONE">ONE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Estado Inicial</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={newContainer.status}
                    onChange={(e) => setNewContainer({...newContainer, status: e.target.value})}
                  >
                    <option value="IN_TRANSIT">En Tránsito</option>
                    <option value="PORT_OF_DESTINATION">Llegada a Puerto</option>
                    <option value="CUSTOMS_RELEASED">Aduana Liberado</option>
                    <option value="DELAY_IN_PORT">Demora Puerto</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">ETA Estimado</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={newContainer.eta}
                    onChange={(e) => setNewContainer({...newContainer, eta: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Nivel de Riesgo</label>
                <select
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                  value={newContainer.risk}
                  onChange={(e) => setNewContainer({...newContainer, risk: e.target.value})}
                >
                  <option value="LOW">Bajo (Sin demoras)</option>
                  <option value="MEDIUM">Medio (Retraso menor)</option>
                  <option value="HIGH">Alto (Congestión / Alerta)</option>
                </select>
              </div>

              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Información del Cliente</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre del destinatario o empresa"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
                    value={newContainer.clientName}
                    onChange={(e) => setNewContainer({...newContainer, clientName: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="WhatsApp (ej: +506 8888-8888)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
                      value={newContainer.clientPhone}
                      onChange={(e) => setNewContainer({...newContainer, clientPhone: e.target.value})}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Correo Electrónico"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-sm"
                      value={newContainer.clientEmail}
                      onChange={(e) => setNewContainer({...newContainer, clientEmail: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Guardar Carga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR CONTENEDOR */}
      {isEditModalOpen && editingContainer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-500" />
                Editar Contenedor: {editingContainer.number}
              </span>
              <button 
                type="button"
                onClick={() => handleDeleteContainer(editingContainer.id)}
                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 rounded-lg transition-all mr-6 flex items-center gap-1 text-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </h2>

            <form onSubmit={handleEditContainer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Naviera (Carrier)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={editingContainer.carrier}
                    onChange={(e) => setEditingContainer({...editingContainer, carrier: e.target.value})}
                  >
                    <option value="Maersk">Maersk</option>
                    <option value="MSC">MSC</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="COSCO">COSCO</option>
                    <option value="ONE">ONE</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Riesgo</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={editingContainer.risk}
                    onChange={(e) => setEditingContainer({...editingContainer, risk: e.target.value})}
                  >
                    <option value="LOW">Bajo</option>
                    <option value="MEDIUM">Medio</option>
                    <option value="HIGH">Alto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Estatus Actual</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={editingContainer.status}
                    onChange={(e) => setEditingContainer({...editingContainer, status: e.target.value})}
                  >
                    <option value="IN_TRANSIT">En Tránsito</option>
                    <option value="PORT_OF_DESTINATION">Llegada a Puerto</option>
                    <option value="CUSTOMS_RELEASED">Aduana Liberado</option>
                    <option value="DELAY_IN_PORT">Demora Puerto</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase">ETA Estimado</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={editingContainer.eta}
                    onChange={(e) => setEditingContainer({...editingContainer, eta: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Información del Cliente</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Nombre del destinatario"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                    value={editingContainer.clientName}
                    onChange={(e) => setEditingContainer({...editingContainer, clientName: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Teléfono"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                      value={editingContainer.clientPhone}
                      onChange={(e) => setEditingContainer({...editingContainer, clientPhone: e.target.value})}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Correo"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-sm"
                      value={editingContainer.clientEmail}
                      onChange={(e) => setEditingContainer({...editingContainer, clientEmail: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Actualizar Carga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIGURACIÓN DE NOTIFICACIONES */}
      {isNotifyModalOpen && notifyingContainer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
            <button 
              onClick={() => {
                setIsNotifyModalOpen(false);
                setNotifyingContainer(null);
              }}
              className="absolute right-4 top-4 p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500 animate-ring" />
              Notificar Alerta: {notifyingContainer.number}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Configure la alerta logística personalizada para el cliente final de esta carga.
            </p>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Canal de Envío</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onChannelChange('WHATSAPP')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      notifyConfig.channel === 'WHATSAPP'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => onChannelChange('EMAIL')}
                    className={`py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      notifyConfig.channel === 'EMAIL'
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    Correo Electrónico
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Destinatario (Contacto)</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                  value={notifyConfig.contactInfo}
                  onChange={(e) => setNotifyConfig({...notifyConfig, contactInfo: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Cuerpo de la Alerta (Mensaje)</label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-650 leading-relaxed resize-none"
                  value={notifyConfig.customMessage}
                  onChange={(e) => setNotifyConfig({...notifyConfig, customMessage: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsNotifyModalOpen(false);
                    setNotifyingContainer(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Enviar Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
