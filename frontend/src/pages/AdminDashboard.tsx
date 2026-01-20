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
  asignado?: string;
  createdAt: string;
  updatedAt: string;
  updatedUser?: { nombre: string; apellido: string };
}

interface VisitaStats {
  localId: number;
  ultimaVisita?: string;
  cantidadVisitas: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, isSupport } = useAuth();
  const [locales, setLocales] = useState<Local[]>([]);
  const [visitasStats, setVisitasStats] = useState<Record<number, VisitaStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = async () => {
    setIsLoading(true);
    try {
      // Si es soporte, obtener solo sus locales; si es admin, obtener todos
      const endpoint = isSupport ? '/locales/soporte/mis-locales' : '/locales';
      const response = await api.get(endpoint);
      setLocales(response.data);
      
      // Obtener estadísticas de visitas
      try {
        const visitasRes = await api.get('/visitas/stats');
        setVisitasStats(visitasRes.data);
      } catch (err) {
        console.log('Visitas stats no disponibles');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cargar locales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocal = async (localId: number) => {
    if (!deleteReason.trim() || !adminPassword.trim()) {
      toast.error('Debe completar la razón y contraseña');
      return;
    }

    try {
      await api.post(`/locales/${localId}/delete-request`, {
        razon: deleteReason,
        passwordAdmin: adminPassword
      });
      toast.success('Solicitud de eliminación enviada');
      setShowDeleteModal(null);
      setDeleteReason('');
      setAdminPassword('');
      await fetchLocales();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar local');
    }
  };

  const filteredLocales = locales.filter(local =>
    local.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.nombreLocal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.comuna.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {isAdmin ? '📊 Panel Admin' : '👨‍💼 Panel Técnico'}
          </h2>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gestión completa de la cadena' : `Mis locales asignados - ${user?.nombre} ${user?.apellido}`}
          </p>
        </div>

        {/* Cards de Resumen */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">
              {isAdmin ? 'Total Locales' : 'Mis Locales'}
            </h3>
            <p className="text-3xl font-bold">{locales.length}</p>
            <p className="text-blue-100 text-sm">
              {isAdmin ? 'Operativos y en revisión' : 'Asignados a tu cargo'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">Visitas Realizadas</h3>
            <p className="text-3xl font-bold">{Object.values(visitasStats).reduce((sum, s) => sum + s.cantidadVisitas, 0)}</p>
            <p className="text-green-100 text-sm">Historial completo</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white"> 
            <h3 className="font-semibold text-lg">
              {isAdmin ? 'Usuarios Soporte' : 'Estado'}
            </h3>
            <p className="text-3xl font-bold">{isAdmin ? 'TBD' : '✅'}</p>
            <p className="text-orange-100 text-sm">
              {isAdmin ? 'Activos esta semana' : 'Todo al día'}
            </p>
          </div>
        </section>

        {/* Sección: Locales */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">
              {isAdmin ? 'Todos los Locales' : 'Mis Locales'}
            </h3>
            <input
              type="text"
              placeholder="Buscar por sigla, nombre o comuna..."
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
              <p className="text-gray-600">No hay locales disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Sigla</th>
                    <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-2 text-left font-semibold">Comuna</th>
                    {isAdmin && <th className="px-4 py-2 text-left font-semibold">Asignado a</th>}
                    <th className="px-4 py-2 text-left font-semibold">Última Visita</th>
                    <th className="px-4 py-2 text-left font-semibold">Actualizado Por</th>
                    <th className="px-4 py-2 text-center font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocales.map((local) => {
                    const stats = visitasStats[local.id];
                    return (
                      <tr key={local.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-red-600">{local.sigla}</td>
                        <td className="px-4 py-3">{local.nombreLocal}</td>
                        <td className="px-4 py-3">{local.comuna}</td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {local.asignado ? local.asignado.split('@')[0] : 'Sin asignar'}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm">
                          {stats?.ultimaVisita 
                            ? new Date(stats.ultimaVisita).toLocaleDateString('es-CL')
                            : 'Sin visitas'
                          }
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {local.updatedUser 
                            ? `${local.updatedUser.nombre} ${local.updatedUser.apellido}`
                            : 'Sistema'
                          }
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            to={`/local/${local.id}`}
                            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Ver
                          </Link>
                          <Link
                            to={`/local/${local.id}/edit`}
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Editar
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => setShowDeleteModal(local.id)}
                              className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modal de Eliminación */}
        {showDeleteModal !== null && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Eliminar Local</h3>
              <p className="text-gray-600 mb-4">
                Debe proporcionar la razón de eliminación y confirmar con su contraseña.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Razón de Eliminación</label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Ej: Local cerrado permanentemente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Contraseña Admin</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(null);
                    setDeleteReason('');
                    setAdminPassword('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteLocal(showDeleteModal)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
