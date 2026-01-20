import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface VisitaStats {
  localId: number;
  localSigla: string;
  localNombre: string;
  cantidadVisitas: number;
  ultimaVisita?: string;
}

export default function Informes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState<VisitaStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    loadEstadisticas();
  }, [mes, anio]);

  const loadEstadisticas = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/visitas/stats?mes=${mes}&anio=${anio}`);
      setEstadisticas(res.data);
    } catch (error) {
      toast.error('Error cargando estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  const totalVisitas = estadisticas.reduce((sum, est) => sum + est.cantidadVisitas, 0);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📊 Informes de Actividad</h1>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <select
                value={mes}
                onChange={(e) => setMes(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              >
                {meses.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={anio}
                onChange={(e) => setAnio(parseInt(e.target.value))}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-blue-600 text-sm font-medium">Total de Visitas</p>
            <p className="text-3xl font-bold text-blue-800 mt-2">{totalVisitas}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-green-600 text-sm font-medium">Locales Visitados</p>
            <p className="text-3xl font-bold text-green-800 mt-2">{estadisticas.length}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-purple-600 text-sm font-medium">Promedio por Local</p>
            <p className="text-3xl font-bold text-purple-800 mt-2">
              {estadisticas.length > 0 ? (totalVisitas / estadisticas.length).toFixed(1) : '0'}
            </p>
          </div>
        </div>

        {/* Tabla de estadísticas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">SIGLA</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">LOCAL</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">VISITAS</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">ÚLTIMA VISITA</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.length > 0 ? (
                estadisticas.map((est, index) => (
                  <tr
                    key={est.localId}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-800">{est.localSigla}</td>
                    <td className="py-4 px-6 text-gray-700">{est.localNombre}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">
                        {est.cantidadVisitas}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {est.ultimaVisita
                        ? new Date(est.ultimaVisita).toLocaleDateString('es-CL')
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 px-6 text-center text-gray-500">
                    No hay visitas registradas en este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
