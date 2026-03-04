import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/header';
import LocalRowExpanded from '../components/LocalRowExpanded';
import { toast } from 'react-toastify';

interface Local {
  id: number;
  sigla: string;
  nombreLocal: string;
  direccion: string;
  comuna: string;
  region?: string;
  marca: string;
  telefonoLocal: string;
  rut?: string;
  razonSocial?: string;
  encargadoLocal?: string;
  esFranquicia?: string;
  asignado?: string;
  createdBy?: number;
}

export default function LocalList() {
  const [locales, setLocales] = useState<Local[]>([]);
  const [filteredLocales, setFilteredLocales] = useState<Local[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<string>('');
  const [showMyLocalesOnly, setShowMyLocalesOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLocalId, setExpandedLocalId] = useState<number | null>(null);
  const { isAdmin, user } = useAuth();

  const marcas = [
    { value: '', label: 'TODAS', color: 'bg-gray-600' },
    { value: 'NIU_EXPRESS', label: 'NIU EXPRESS', color: 'bg-black' },
    { value: 'NIU_SUSHI', label: 'NU SUSHI', color: 'bg-red-600' },
    { value: 'GUACAMOLE', label: 'GUACAMOLE', color: 'bg-green-500' },
    { value: 'NIU_MEXICO', label: 'MEXICO', color: 'bg-yellow-500' }
  ];

  useEffect(() => {
    loadLocales();
  }, []);

  useEffect(() => {
    filterLocales();
  }, [locales, selectedMarca, showMyLocalesOnly]);

  const loadLocales = async () => {
    try {
      const response = await api.get('/locales');
      setLocales(response.data);
    } catch (error) {
      toast.error('Error cargando locales');
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocales = () => {
    let filtered = locales;

    // Filtrar por marca si está seleccionada
    if (selectedMarca) {
      filtered = filtered.filter(local => local.marca === selectedMarca);
    }

    // Filtrar por "Mis Locales" si está activado
    if (showMyLocalesOnly && user) {
      filtered = filtered.filter(local =>
        local.asignado === user.email || local.createdBy === user.id
      );
    }

    setFilteredLocales(filtered);
  };

  const handleDeleteLocal = async (id: number) => {
    try {
      await api.delete(`/locales/${id}`);
      toast.success('Local eliminado correctamente');
      setExpandedLocalId(null);
      loadLocales();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Error eliminando local');
    }
  };

  const getMarcaStyle = (marca: string) => {
    const marcaInfo = marcas.find(m => m.value === marca);
    return marcaInfo ? marcaInfo.color : 'bg-gray-400';
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4 justify-between items-center">
            <div className="flex flex-wrap gap-2 justify-center flex-1">
              {marcas.map((marca) => (
                <button
                  key={marca.value}
                  onClick={() => setSelectedMarca(marca.value)}
                  className={`px-4 py-2 rounded-full text-white font-medium text-sm transition-all ${marca.color} ${selectedMarca === marca.value ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
                >
                  {marca.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMyLocalesOnly(!showMyLocalesOnly)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${showMyLocalesOnly ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-gray-400' : 'bg-gray-600 text-white opacity-70 hover:opacity-100'}`}
            >
              Mis Locales
            </button>
          </div>
       <Link to="/local/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
         Nuevo Local
       </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">SIGLA LOCAL</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">NOMBRE</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">DIRECCION</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">ENCARGADO</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">IP VPN</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">NUMERO LOCAL</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocales.length > 0 ? (
                filteredLocales.map((local, index) => (
                  <React.Fragment key={local.id}>
                    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getMarcaStyle(local.marca)}`}></div>
                          <span className="font-medium text-gray-800">{local.sigla}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            setExpandedLocalId(expandedLocalId === local.id ? null : local.id)
                          }
                          className="text-blue-600 hover:underline hover:text-blue-800 font-medium transition-colors"
                        >
                          {local.nombreLocal}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div>{local.direccion}</div>
                        <div className="text-sm text-gray-500">{local.comuna}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{local.asignado || 'Sin asignar'}</td>
                      <td className="py-4 px-6">
                        <a
                          href={`http://192.168.1.${local.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors inline-block font-medium"
                        >
                          192.168.1.{local.id}
                        </a>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{local.telefonoLocal}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-center">
                          <Link to={`/local/${local.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm">
                             Editar
                          </Link>
                          <Link to={`/visitas`} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm">
                             Visita
                          </Link>
                        </div>
                      </td>
                    </tr>
                    {expandedLocalId === local.id && (
                      <tr>
                        <td colSpan={7} className="p-0 border-b-2 border-gray-200">
                          <LocalRowExpanded
                            local={local}
                            onEdit={(id) => {}}
                            onDelete={handleDeleteLocal}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-2">
                        {showMyLocalesOnly 
                          ? '📭 No hay locales asignados' 
                          : selectedMarca 
                          ? '📭 No hay locales de esta marca' 
                          : '📭 No hay locales disponibles'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {showMyLocalesOnly 
                          ? 'No tienes locales asignados en este momento' 
                          : 'Intenta cambiar los filtros'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
