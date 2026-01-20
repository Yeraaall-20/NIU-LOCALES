import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Nota {
  id: number;
  localId: number;
  contenido: string;
  tipo: 'ADMIN' | 'TECNICO';
  fechaProgramada?: string;
  completada: boolean;
  createdBy: number;
  createdUser: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotesSectionProps {
  localId: number;
}

export default function NotesSection({ localId }: NotesSectionProps) {
  const { user, isAdmin } = useAuth();
  const [notas, setNotas] = useState<Nota[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    contenido: '',
    tipo: isAdmin ? 'ADMIN' : 'TECNICO',
    fechaProgramada: ''
  });

  useEffect(() => {
    fetchNotas();
  }, [localId]);

  const fetchNotas = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/notas/${localId}`);
      setNotas(response.data);
    } catch (error: any) {
      toast.error('Error cargando notas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contenido.trim()) {
      toast.error('La nota no puede estar vacía');
      return;
    }

    try {
      if (editingId) {
        // Actualizar
        await api.put(`/notas/${editingId}`, {
          contenido: formData.contenido,
          fechaProgramada: formData.fechaProgramada || null
        });
        toast.success('Nota actualizada');
      } else {
        // Crear
        await api.post('/notas', {
          localId: parseInt(localId.toString()),
          contenido: formData.contenido,
          tipo: formData.tipo,
          fechaProgramada: formData.fechaProgramada || null
        });
        toast.success('Nota creada');
      }

      setFormData({ contenido: '', tipo: isAdmin ? 'ADMIN' : 'TECNICO', fechaProgramada: '' });
      setEditingId(null);
      setShowForm(false);
      await fetchNotas();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error guardando nota');
    }
  };

  const handleEdit = (nota: Nota) => {
    setEditingId(nota.id);
    setFormData({
      contenido: nota.contenido,
      tipo: nota.tipo,
      fechaProgramada: nota.fechaProgramada ? nota.fechaProgramada.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta nota?')) return;

    try {
      await api.delete(`/notas/${id}`);
      toast.success('Nota eliminada');
      await fetchNotas();
    } catch (error: any) {
      toast.error('Error eliminando nota');
    }
  };

  const handleToggleComplete = async (nota: Nota) => {
    try {
      await api.put(`/notas/${nota.id}`, {
        completada: !nota.completada
      });
      await fetchNotas();
    } catch (error: any) {
      toast.error('Error actualizando nota');
    }
  };

  const notasAdmin = notas.filter(n => n.tipo === 'ADMIN');
  const notasTecnico = notas.filter(n => n.tipo === 'TECNICO');

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">📝 Notas</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ contenido: '', tipo: isAdmin ? 'ADMIN' : 'TECNICO', fechaProgramada: '' });
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancelar' : '+ Nueva Nota'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Contenido de la nota</label>
            <textarea
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              placeholder="Describe la mejora o trabajo a realizar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Nota</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'ADMIN' | 'TECNICO' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="TECNICO">Técnico</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Fecha programada (opcional)</label>
              <input
                type="date"
                value={formData.fechaProgramada}
                onChange={(e) => setFormData({ ...formData, fechaProgramada: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
          >
            {editingId ? 'Actualizar Nota' : 'Guardar Nota'}
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-600">Cargando notas...</p>
      ) : notas.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay notas aún. ¡Crea una!</p>
      ) : (
        <div className="space-y-6">
          {/* Notas de Admin */}
          {notasAdmin.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-red-600 mb-3">📌 Notas de Admin</h4>
              <div className="space-y-3">
                {notasAdmin.map((nota) => (
                  <div
                    key={nota.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      nota.completada
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {nota.completada && <span className="text-green-600 font-bold">✅</span>}
                          <p className={`text-sm ${nota.completada ? 'line-through text-gray-600' : 'font-semibold'}`}>
                            {nota.contenido}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Por: {nota.createdUser.nombre} {nota.createdUser.apellido}
                        </p>
                        {nota.fechaProgramada && (
                          <p className="text-xs text-blue-600 mt-1">
                            📅 Fecha programada: {new Date(nota.fechaProgramada).toLocaleDateString('es-CL')}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(nota.createdAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleComplete(nota)}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            nota.completada
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {nota.completada ? 'Deshacer' : 'Completar'}
                        </button>
                        {nota.createdBy === user?.id && (
                          <>
                            <button
                              onClick={() => handleEdit(nota)}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(nota.id)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas de Técnico */}
          {notasTecnico.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-blue-600 mb-3">👨‍🔧 Notas de Técnico</h4>
              <div className="space-y-3">
                {notasTecnico.map((nota) => (
                  <div
                    key={nota.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      nota.completada
                        ? 'bg-green-50 border-green-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {nota.completada && <span className="text-green-600 font-bold">✅</span>}
                          <p className={`text-sm ${nota.completada ? 'line-through text-gray-600' : 'font-semibold'}`}>
                            {nota.contenido}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">
                          Por: {nota.createdUser.nombre} {nota.createdUser.apellido}
                        </p>
                        {nota.fechaProgramada && (
                          <p className="text-xs text-green-600 mt-1">
                            📅 Fecha programada: {new Date(nota.fechaProgramada).toLocaleDateString('es-CL')}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(nota.createdAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleComplete(nota)}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            nota.completada
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {nota.completada ? 'Deshacer' : 'Completar'}
                        </button>
                        {nota.createdBy === user?.id && (
                          <>
                            <button
                              onClick={() => handleEdit(nota)}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(nota.id)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
