import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Local {
  id: number;
  sigla: string;
  nombreLocal: string;
  direccion: string;
  comuna: string;
  encargadoLocal?: string;
  tieneUps?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Nota {
  id: number;
  localId: number;
  contenido: string;
  createdAt: string;
}

interface Visita {
  id: number;
  localId: number;
  descripcion?: string;
  tipoVisita: string;
  fecha: string;
  observaciones?: string;
}

export default function SupportDashboard() {
  const { user } = useAuth();
  const [misLocales, setMisLocales] = useState<Local[]>([]);
  const [notas, setNotas] = useState<Record<number, Nota[]>>({});
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocalId, setSelectedLocalId] = useState<number | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showVisitModal, setShowVisitModal] = useState<number | null>(null);
  const [visitForm, setVisitForm] = useState({
    descripcion: '',
    tipoVisita: 'revision',
    observaciones: ''
  });

  useEffect(() => {
    fetchMisLocales();
  }, []);

  const fetchMisLocales = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/locales/soporte/mis-locales');
      setMisLocales(response.data);
      
      // Cargar notas y visitas
      try {
        const notasRes = await api.get('/notas');
        const notasMap: Record<number, Nota[]> = {};
        notasRes.data.forEach((nota: Nota) => {
          if (!notasMap[nota.localId]) notasMap[nota.localId] = [];
          notasMap[nota.localId].push(nota);
        });
        setNotas(notasMap);
      } catch (err) {
        console.log('Notas no disponibles');
      }

      try {
        const visitasRes = await api.get('/visitas');
        setVisitas(visitasRes.data);
      } catch (err) {
        console.log('Visitas no disponibles');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cargar locales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (localId: number) => {
    if (!newNoteContent.trim()) {
      toast.error('La nota no puede estar vacía');
      return;
    }

    try {
      await api.post('/notas', {
        localId,
        contenido: newNoteContent
      });
      toast.success('Nota agregada');
      setNewNoteContent('');
      setSelectedLocalId(null);
      await fetchMisLocales();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al agregar nota');
    }
  };

  const handleAddVisit = async (localId: number) => {
    if (!visitForm.descripcion.trim()) {
      toast.error('La descripción de visita es requerida');
      return;
    }

    try {
      await api.post('/visitas', {
        localId,
        ...visitForm
      });
      toast.success('Visita registrada');
      setShowVisitModal(null);
      setVisitForm({ descripcion: '', tipoVisita: 'revision', observaciones: '' });
      await fetchMisLocales();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrar visita');
    }
  };

  const filteredLocales = misLocales.filter(local =>
    local.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.nombreLocal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUltimaVisita = (localId: number) => {
    const visitasLocal = visitas.filter(v => v.localId === localId);
    if (visitasLocal.length === 0) return null;
    return visitasLocal.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];
  };

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Panel Soporte - Mis Locales</h2>

        {/* Cards de Resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">Locales Asignados</h3>
            <p className="text-3xl font-bold">{misLocales.length}</p>
            <p className="text-blue-100 text-sm">A tu cargo</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">Visitas Realizadas</h3>
            <p className="text-3xl font-bold">{visitas.length}</p>
            <p className="text-green-100 text-sm">Historial de visitas</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">Notas Pendientes</h3>
            <p className="text-3xl font-bold">{Object.values(notas).reduce((sum, n) => sum + n.length, 0)}</p>
            <p className="text-orange-100 text-sm">Cambios a realizar</p>
          </div>
        </section>

        {/* Sección: Mis Locales */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Mis Locales</h3>
            <input
              type="text"
              placeholder="Buscar por sigla o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando locales...</p>
            </div>
          ) : filteredLocales.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No tienes locales asignados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Sigla</th>
                    <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-2 text-left font-semibold">Comuna</th>
                    <th className="px-4 py-2 text-left font-semibold">Última Visita</th>
                    <th className="px-4 py-2 text-left font-semibold">Notas</th>
                    <th className="px-4 py-2 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocales.map((local) => {
                    const ultimaVisita = getUltimaVisita(local.id);
                    const localNotas = notas[local.id] || [];
                    return (
                      <tr key={local.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-red-600">{local.sigla}</td>
                        <td className="px-4 py-3">{local.nombreLocal}</td>
                        <td className="px-4 py-3">{local.comuna}</td>
                        <td className="px-4 py-3 text-sm">
                          {ultimaVisita 
                            ? new Date(ultimaVisita.fecha).toLocaleDateString('es-CL')
                            : 'Sin visitas'
                          }
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {localNotas.length > 0 ? (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {localNotas.length} notas
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setShowVisitModal(local.id)}
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Visita
                          </button>
                          <button
                            onClick={() => setSelectedLocalId(local.id)}
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Nota
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modal Agregar Nota */}
        {selectedLocalId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Agregar Nota al Local</h3>
              
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Describa el cambio o pendiente que requiere este local..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
                rows={5}
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setSelectedLocalId(null);
                    setNewNoteContent('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleAddNote(selectedLocalId)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Agregar Nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Registrar Visita */}
        {showVisitModal !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Registrar Visita</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Visita</label>
                <select
                  value={visitForm.tipoVisita}
                  onChange={(e) => setVisitForm({ ...visitForm, tipoVisita: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="revision">Revisión</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="instalacion">Instalación</option>
                  <option value="reparacion">Reparación</option>
                  <option value="inspeccion">Inspección</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={visitForm.descripcion}
                  onChange={(e) => setVisitForm({ ...visitForm, descripcion: e.target.value })}
                  placeholder="Describa lo realizado en la visita..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={visitForm.observaciones}
                  onChange={(e) => setVisitForm({ ...visitForm, observaciones: e.target.value })}
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowVisitModal(null);
                    setVisitForm({ descripcion: '', tipoVisita: 'revision', observaciones: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleAddVisit(showVisitModal)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Registrar Visita
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
