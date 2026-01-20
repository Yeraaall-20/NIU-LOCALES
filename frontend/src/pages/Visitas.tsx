import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Local {
  id: number;
  sigla: string;
  nombreLocal: string;
}

interface Visita {
  id: number;
  localId: number;
  local?: Local;
  descripcion: string;
  tipoVisita: string;
  fecha: string;
  duracion?: number;
  observaciones?: string;
}

export default function Visitas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [selectedLocalId, setSelectedLocalId] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [tipoVisita, setTipoVisita] = useState('mantenimiento');
  const [observaciones, setObservaciones] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tiposVisita = [
    { value: 'mantenimiento', label: '🔧 Mantenimiento' },
    { value: 'revision', label: '🔍 Revisión' },
    { value: 'instalacion', label: '📦 Instalación' },
    { value: 'soporte', label: '🆘 Soporte' },
    { value: 'otro', label: '📋 Otro' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [localesRes, visitasRes] = await Promise.all([
        api.get('/locales'),
        api.get('/visitas')
      ]);
      setLocales(localesRes.data);
      setVisitas(visitasRes.data);
    } catch (error) {
      toast.error('Error cargando datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocalId || !descripcion.trim()) {
      toast.error('Selecciona un local y descripción');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/visitas', {
        localId: selectedLocalId,
        descripcion,
        tipoVisita,
        observaciones
      });
      toast.success('Visita registrada exitosamente');
      setDescripcion('');
      setTipoVisita('mantenimiento');
      setObservaciones('');
      setSelectedLocalId(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrar visita');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario de nueva visita */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">📍 Registrar Visita</h2>
              <form onSubmit={handleSubmitVisita} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local *
                  </label>
                  <select
                    value={selectedLocalId || ''}
                    onChange={(e) => setSelectedLocalId(parseInt(e.target.value) || null)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Selecciona un local</option>
                    {locales.map((local) => (
                      <option key={local.id} value={local.id}>
                        {local.sigla} - {local.nombreLocal}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Visita *
                  </label>
                  <select
                    value={tipoVisita}
                    onChange={(e) => setTipoVisita(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  >
                    {tiposVisita.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Describe la visita..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    rows={2}
                    placeholder="Observaciones adicionales..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Registrando...' : '✅ Registrar Visita'}
                </button>
              </form>
            </div>
          </div>

          {/* Historial de visitas */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">📋 Historial de Visitas</h2>
              {visitas.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {visitas.map((visita) => (
                    <div
                      key={visita.id}
                      className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{visita.local?.sigla}</p>
                          <p className="text-sm text-gray-600">{visita.local?.nombreLocal}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {tiposVisita.find(t => t.value === visita.tipoVisita)?.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{visita.descripcion}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(visita.fecha).toLocaleDateString('es-CL')}</span>
                        {visita.duracion && <span>{visita.duracion} min</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay visitas registradas</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
