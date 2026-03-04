import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotesSection from './NotesSection';

interface Local {
  id: number;
  sigla: string;
  nombreLocal: string;
  direccion: string;
  comuna: string;
  region?: string;
  marca: string;
  rut?: string;
  razonSocial?: string;
  encargadoLocal?: string;
  esFranquicia?: string;
  asignado?: string;
  tieneUps?: boolean;
  dispositivoRed?: string;
}

interface LocalRowExpandedProps {
  local: Local;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getMarcaStyle = (marca: string) => {
  const marcasMap: Record<string, { color: string; label: string }> = {
    NIU_EXPRESS: { color: 'bg-black', label: 'NIU EXPRESS' },
    NIU_SUSHI: { color: 'bg-red-600', label: 'NIU SUSHI' },
    GUACAMOLE: { color: 'bg-green-500', label: 'GUACAMOLE' },
    NIU_MEXICO: { color: 'bg-yellow-500', label: 'MEXICO' }
  };
  return marcasMap[marca] || { color: 'bg-gray-400', label: marca };
};

export default function LocalRowExpanded({ local, onEdit, onDelete }: LocalRowExpandedProps) {
  const navigate = useNavigate();
  const marcaInfo = getMarcaStyle(local.marca);

  const handleEdit = () => {
    navigate(`/local/${local.id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el local "${local.nombreLocal}"?`)) {
      onDelete(local.id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
      {/* Encabezado con sigla y nombre */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${marcaInfo.color}`}></div>
          <span className="text-sm font-semibold text-gray-600">{local.sigla}</span>
          <h3 className="text-xl font-bold text-gray-800">{local.nombreLocal}</h3>
        </div>
      </div>

      {/* Información principal en grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Columna 1 - Ubicación */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Ubicación</p>
            <p className="text-sm text-gray-700 font-medium">{local.direccion}</p>
            <p className="text-sm text-gray-500">
              {local.comuna}
              {local.region && `, ${local.region}`}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Marca</p>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${marcaInfo.color}`}></div>
              <span className="text-sm font-medium text-gray-700">{marcaInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Columna 2 - Información Legal */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Empresa</p>
            <p className="text-sm text-gray-700 font-medium">{local.razonSocial || 'N/A'}</p>
            <p className="text-xs text-gray-500">{local.rut || 'RUT N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Encargado</p>
            <p className="text-sm text-gray-700 font-medium">{local.encargadoLocal || 'Sin asignar'}</p>
            {local.esFranquicia && (
              <p className="text-xs text-gray-500 mt-1">
                {local.esFranquicia === 'FRANQUICIA' ? '🔗 Franquicia' : '🏢 Propio'}
              </p>
            )}
          </div>
        </div>

        {/* Columna 3 - Asignación e Infraestructura */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Asignado a</p>
            <p className="text-sm text-gray-700 font-medium break-all">{local.asignado || 'No asignado'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Infraestructura</p>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">UPS:</span>{' '}
                <span>{local.tieneUps ? '✅ Sí' : '❌ No'}</span>
              </p>
              {local.dispositivoRed && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Dispositivo:</span> {local.dispositivoRed}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Notas/Comentarios */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📝 Notas y Comentarios
        </h4>
        <NotesSection localId={local.id} />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-2"
        >
          ✏️ Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-2"
        >
          🗑️ Anular
        </button>
      </div>
    </div>
  );
}
