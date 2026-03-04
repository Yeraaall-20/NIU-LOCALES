import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

interface Visita {
  id: number;
  fecha: string;
  localId: number;
  local: { sigla: string; nombreLocal: string };
  userId: number;
  user: { nombre: string; apellido: string; email: string };
  tipoVisita: string;
  descripcion: string;
  duracion?: number;
  observaciones?: string;
}

export default function Informes() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    loadVisitas();
  }, [mes, anio]);

  const loadVisitas = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/visitas?mes=${mes}&anio=${anio}`);
      setVisitas(res.data || []);
    } catch (error) {
      toast.error('Error cargando visitas');
      setVisitas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportarExcel = () => {
    if (visitas.length === 0) {
      toast.warning('No hay visitas para exportar');
      return;
    }

    // Preparar datos para Excel
    const datosExcel = visitas.map(visita => ({
      'Fecha': new Date(visita.fecha).toLocaleDateString('es-CL'),
      'Usuario': `${visita.user.nombre} ${visita.user.apellido}`,
      'Email': visita.user.email,
      'Local': `${visita.local.sigla} - ${visita.local.nombreLocal}`,
      'Tipo de Visita': visita.tipoVisita,
      'Descripción': visita.descripcion || '-'
    }));

    // Crear workbook y worksheet
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 12 }, // Fecha
      { wch: 20 }, // Usuario
      { wch: 25 }, // Email
      { wch: 30 }, // Local
      { wch: 18 }, // Tipo de Visita
      { wch: 30 }  // Descripción
    ];
    worksheet['!cols'] = colWidths;

    // Generar nombre del archivo
    const nombreMes = new Date(anio, mes - 1).toLocaleDateString('es-CL', { month: 'long' });
    const nombreArchivo = `Informe_Visitas_${nombreMes}_${anio}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(workbook, nombreArchivo);
    toast.success(`Excel descargado: ${nombreArchivo}`);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📋 Registro de Visitas</h1>
          <p className="text-gray-600 text-sm mb-4">
            {isAdmin
              ? 'Viendo todas las visitas de todos los usuarios'
              : 'Viendo tus visitas registradas'}
          </p>

          {/* Filtros y Botón de Exportar */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-end flex-wrap">
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
            <div className="ml-auto">
              <button
                onClick={exportarExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                📥 Descargar Excel
              </button>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-semibold">
            Total de visitas: <span className="text-2xl">{visitas.length}</span>
          </p>
        </div>

        {/* Tabla de visitas */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">FECHA</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">USUARIO</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">LOCAL</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">TIPO</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length > 0 ? (
                visitas.map((visita, index) => (
                  <tr
                    key={visita.id}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {new Date(visita.fecha).toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      <div className="font-medium">{visita.user.nombre} {visita.user.apellido}</div>
                      <div className="text-sm text-gray-500">{visita.user.email}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      <div className="font-medium">{visita.local.sigla}</div>
                      <div className="text-sm text-gray-500">{visita.local.nombreLocal}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {visita.tipoVisita}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {visita.descripcion || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-gray-500">
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
