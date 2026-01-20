import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Header from '../components/header';
import NotesSection from '../components/NotesSection';

interface LocalDetails {
  id: number;
  sigla: string;
  nombreLocal: string;
  direccion: string;
  comuna: string;
  region: string;
  pais: string;
  telefonoLocal: string;
  marca: string;
  tipoLocal: string;
  asignado?: string;
  encargadoLocal?: string;
  rut?: string;
  razonSocial?: string;
  dvrModelo: string;
  dvrCapacidadDisco: string;
  dvrNumeroCamaras: string;
  lastModifiedAt?: string;
  lastModifiedSection?: string;
  updatedUser?: { nombre: string; apellido: string };
  createdBy?: number;
  createdUser?: { nombre: string; apellido: string };
  createdAt: string;
  updatedAt: string;
}

export default function LocalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [local, setLocal] = useState<LocalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determinar si el usuario puede editar
  const canEdit = user && local && (isAdmin || local.createdBy === user.id || local.asignado === user.email);

  useEffect(() => {
    if (id) fetchLocal();
  }, [id]);

  const fetchLocal = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/locales/${id}`);
      setLocal(response.data);
    } catch (error: any) {
      toast.error('Error cargando local');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Cargando...</div>;
  if (!local) return <div className="text-center py-8">Local no encontrado</div>;

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Volver al dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{local.sigla} - {local.nombreLocal}</h1>
          <p className="text-gray-600">{local.direccion}, {local.comuna}</p>
        </div>

        {/* Información básica */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">📍 Ubicación</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Dirección:</strong> {local.direccion}</p>
              <p><strong>Comuna:</strong> {local.comuna}</p>
              <p><strong>Región:</strong> {local.region}</p>
              <p><strong>País:</strong> {local.pais}</p>
              <p><strong>Teléfono:</strong> {local.telefonoLocal}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">🏪 Información Comercial</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Marca:</strong> {local.marca}</p>
              <p><strong>Tipo:</strong> {local.tipoLocal}</p>
              <p><strong>RUT:</strong> {local.rut || '-'}</p>
              <p><strong>Razón Social:</strong> {local.razonSocial || '-'}</p>
              <p><strong>Encargado:</strong> {local.encargadoLocal || '-'}</p>
              {local.asignado && <p><strong>Asignado a:</strong> {local.asignado}</p>}
            </div>
          </div>
        </section>

        {/* DVR y Seguridad */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4">📹 Configuración DVR/CCTV</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Modelo</p>
              <p className="font-semibold">{local.dvrModelo}</p>
            </div>
            <div>
              <p className="text-gray-600">Capacidad Disco</p>
              <p className="font-semibold">{local.dvrCapacidadDisco}</p>
            </div>
            <div>
              <p className="text-gray-600">Número Cámaras</p>
              <p className="font-semibold">{local.dvrNumeroCamaras}</p>
            </div>
          </div>
        </section>

        {/* Auditoría */}
        <section className="bg-gray-50 p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4">🕐 Auditoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Creado</p>
              <p className="font-semibold">
                {new Date(local.createdAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Última modificación</p>
              <p className="font-semibold">
                {local.lastModifiedAt
                  ? new Date(local.lastModifiedAt).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Sin modificaciones'}
              </p>
              {local.lastModifiedSection && (
                <p className="text-xs text-gray-600 mt-1">
                  Sección modificada: <span className="bg-yellow-100 px-2 py-1 rounded">{local.lastModifiedSection}</span>
                </p>
              )}
            </div>
            {local.updatedUser && (
              <div className="md:col-span-2">
                <p className="text-gray-600">Modificado por</p>
                <p className="font-semibold">{local.updatedUser.nombre} {local.updatedUser.apellido}</p>
              </div>
            )}
          </div>
        </section>

        {/* Notas */}
        {id && <NotesSection localId={parseInt(id)} />}

        {/* Acciones */}
        <section className="mt-6 flex gap-3">
          {canEdit ? (
            <button
              onClick={() => navigate(`/local/${id}/edit`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              ✏️ Editar Local
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800">
              <p className="font-semibold">📖 Solo lectura</p>
              <p className="text-sm">Solo los propietarios de este local pueden editarlo. Puedes dejar notas o registrar visitas.</p>
            </div>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            Volver
          </button>
        </section>
      </main>
    </div>
  );
}
