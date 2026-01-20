import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/header';
import { toast } from 'react-toastify';

const brandPrefix: Record<string, string> = {
  NIU_SUSHI: 'NICL',
  NIU_EXPRESS: 'NECL',
  GUACAMOLE: 'GUCL',
  KAO: 'KCL',
  NIU_MEXICO: 'NIMX'
};

const empresasData = [
  { rut: '76.052.862-5', razonSocial: 'MISHPAJA LTDA' },
  { rut: '76.144.891-9', razonSocial: 'COMERCIAL KUTZA' },
  { rut: '76.214.849-8', razonSocial: 'COMERCIAL TIKVA LTDA' },
  { rut: '76.263.788-k', razonSocial: 'COMERCIAL AJIM LTDA' },
  { rut: '76.269.131-0', razonSocial: 'COMERCIAL SIMJA LTDA' },
  { rut: '76.363.625-9', razonSocial: 'COMERCIAL GADOL LTDA' },
  { rut: '76.363.629-1', razonSocial: 'COMERCIAL OR LTDA' },
  { rut: '76.425.158-k', razonSocial: 'COMERCIAL TOV LTDA' },
  { rut: '76.432.258-4', razonSocial: 'COMERCIAL MAZAL LTDA' },
  { rut: '76.486.005-5', razonSocial: 'KAO THAI SPA' },
  { rut: '76.777.491-5', razonSocial: 'COMERCIAL SAMEAJ LTDA' },
  { rut: '76.920.910-7', razonSocial: 'OJI LTDA' },
  { rut: '77.147.186-2', razonSocial: 'GUACAMOLE SPA' },
  { rut: '76871388-K', razonSocial: 'ADMINISTRADORA FRANQUICIAS NIU SPA' },
  { rut: '76.218.987-9', razonSocial: 'COMERCIAL JAVERIM LIMITADA' },
  { rut: '76179727-1', razonSocial: 'MAJANE SERVICIOS ADMINISTRATIVOS Y DE CAPACITACION LIMITADA' },
  { rut: '77.147.192-7', razonSocial: 'NIU EXPRESS SPA' },
  { rut: '76336286-8', razonSocial: 'RESTOMARKET SPA' }
];

const encargados = [
  'CHARLOTTE COLEMAN',
  'CHRISTOPHER GUERRA', 
  'DAVID CONDE',
  'JUAN PABLO PALMA',
  'YERALL ALVAREZ'
];

const serviciosAudio = [
  'APP SOUNDTRACK',
  'EQUIPO SOUNDTRACK',
  'POE SOUND UNIFI'
];

export default function LocalNew() {
  const navigate = useNavigate();
  
  // Identificacion
  const [marca, setMarca] = useState('NIU_SUSHI');
  const [number, setNumber] = useState<string>('1');
  const [sigla, setSigla] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [rut, setRut] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [encargadoLocal, setEncargadoLocal] = useState('');
  const [esFranquicia, setEsFranquicia] = useState('');
  const [tieneUps, setTieneUps] = useState(false);
  const [servicioAudio, setServicioAudio] = useState('');
  
  // Ubicacion
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');
  const [region, setRegion] = useState('');
  const [pais, setPais] = useState('Chile');
  
  // Telefonia Basica - AGREGADO telefono de respaldo
  const [telefonoLocal, setTelefonoLocal] = useState('');
  const [telefono01, setTelefono01] = useState('');
  const [telefono02, setTelefono02] = useState('');
  const [telefono03, setTelefono03] = useState('');
  const [telefonoRespaldo, setTelefonoRespaldo] = useState('');
  
  // Telefonia por Proveedor - CLARO (numero, tarifa, 3 anexos)
  const [claroNumero, setClaroNumero] = useState('');
  const [claroTarifa, setClaroTarifa] = useState('');
  const [claroAnexo1, setClaroAnexo1] = useState('');
  const [claroAnexo2, setClaroAnexo2] = useState('');
  const [claroAnexo3, setClaroAnexo3] = useState('');
  
  // Telefonia por Proveedor - GTD
  const [gtdNumero, setGtdNumero] = useState('');
  const [gtdTarifa, setGtdTarifa] = useState('');
  const [gtdAnexo1, setGtdAnexo1] = useState('');
  const [gtdAnexo2, setGtdAnexo2] = useState('');
  const [gtdAnexo3, setGtdAnexo3] = useState('');
  
  // Telefonia por Proveedor - ENTEL
  const [entelNumero, setEntelNumero] = useState('');
  const [entelTarifa, setEntelTarifa] = useState('');
  const [entelAnexo1, setEntelAnexo1] = useState('');
  const [entelAnexo2, setEntelAnexo2] = useState('');
  const [entelAnexo3, setEntelAnexo3] = useState('');
  
  // Telefonia por Proveedor - MOVISTAR
  const [movistarNumero, setMovistarNumero] = useState('');
  const [movistarTarifa, setMovistarTarifa] = useState('');
  const [movistarAnexo1, setMovistarAnexo1] = useState('');
  const [movistarAnexo2, setMovistarAnexo2] = useState('');
  const [movistarAnexo3, setMovistarAnexo3] = useState('');
  
  // Red - Dispositivos de red y enlaces
  const [dispositivoRed, setDispositivoRed] = useState('UDM');
  const [enlacePrincipal, setEnlacePrincipal] = useState('');
  const [enlaceSecundario, setEnlaceSecundario] = useState('');
  const [enlaceTercero, setEnlaceTercero] = useState('');
  const [switchCantidad, setSwitchCantidad] = useState('1');
  const [switchPuertos, setSwitchPuertos] = useState('8');
  const [apCantidad, setApCantidad] = useState('');
  const [teltonikaMarca, setTeltonikaMarca] = useState('');
  const [teltonikaModelo, setTeltonikaModelo] = useState('');
  const [claveWifiInterna, setClaveWifiInterna] = useState('');
  
  // Hardware - Servidor Principal + Proxmox
  const [servidorPrincipalModelo, setServidorPrincipalModelo] = useState('');
  const [servidorPrincipalDisco, setServidorPrincipalDisco] = useState('');
  const [servidorPrincipalRam, setServidorPrincipalRam] = useState('');
  const [servidorPrincipalProcesador, setServidorPrincipalProcesador] = useState('');
  const [servidorPrincipalProxmox, setServidorPrincipalProxmox] = useState(false);
  
  // Hardware - Servidor Respaldo + Proxmox
  const [servidorRespaldoModelo, setServidorRespaldoModelo] = useState('');
  const [servidorRespaldoDisco, setServidorRespaldoDisco] = useState('');
  const [servidorRespaldoRam, setServidorRespaldoRam] = useState('');
  const [servidorRespaldoProcesador, setServidorRespaldoProcesador] = useState('');
  const [servidorRespaldoProxmox, setServidorRespaldoProxmox] = useState(false);
  
  // CCTV - Configuracion DVR NUEVA ESTRUCTURA
  const [dvrModelo, setDvrModelo] = useState('');
  const [dvrCapacidadDisco, setDvrCapacidadDisco] = useState('');
  const [dvrNumeroCamaras, setDvrNumeroCamaras] = useState('');
  const [dvrUsuarioAdmin, setDvrUsuarioAdmin] = useState('');
  const [dvrUsuarioOperaciones, setDvrUsuarioOperaciones] = useState('');
  const [dvrClaveAdmin, setDvrClaveAdmin] = useState('');
  const [dvrClaveOperaciones, setDvrClaveOperaciones] = useState('');
  


  function computeSigla(marcaKey: string, numStr: string) {
    const prefix = brandPrefix[marcaKey] || 'LOC';
    const n = parseInt(numStr || '0', 10);
    const padded = n < 10 ? `0${n}` : `${n}`;
    return `${prefix}${padded}`;
  }

  React.useEffect(() => {
    setSigla(computeSigla(marca, number));
  }, [marca, number]);

  // Auto-compute next number for selected brand based on existing locales
  React.useEffect(() => {
    let mounted = true;
    async function computeNext() {
      try {
        const res = await api.get('/locales');
        const locales: any[] = res.data || [];
        const prefix = brandPrefix[marca] || '';
        const nums = locales
          .map(l => l.sigla as string)
          .filter(s => typeof s === 'string' && s.startsWith(prefix))
          .map(s => s.replace(prefix, ''))
          .map(s => parseInt(s, 10))
          .filter(n => !isNaN(n));

        const max = nums.length ? Math.max(...nums) : 0;
        const next = max + 1;
        if (mounted) {
          setNumber(String(next));
        }
      } catch (err) {
        // ignore error when fetching locales
      }
    }

    computeNext();
    return () => { mounted = false };
  }, [marca]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    console.log('=== SUBMIT INICIADO ===');
    console.log('Sigla:', sigla);
    console.log('Nombre Local:', nombreLocal);
    console.log('DVR Modelo:', dvrModelo);

    // Validación de campos obligatorios
    if (!sigla || !nombreLocal || !direccion || !comuna || !region || !pais || !rut || !razonSocial || !encargadoLocal || !esFranquicia || !servicioAudio) {
      console.log('ERROR: Campos obligatorios de identificación faltantes');
      toast.error('Por favor completa todos los campos obligatorios de Identificación y Ubicación');
      return;
    }

    if (!dvrModelo || !dvrCapacidadDisco || !dvrNumeroCamaras || !dvrUsuarioAdmin || !dvrUsuarioOperaciones || !dvrClaveAdmin || !dvrClaveOperaciones) {
      console.log('ERROR: Campos obligatorios de CCTV faltantes');
      console.log('DVR Modelo:', dvrModelo);
      console.log('DVR Capacidad:', dvrCapacidadDisco);
      console.log('DVR Cámaras:', dvrNumeroCamaras);
      toast.error('Por favor completa todos los campos obligatorios de CCTV');
      return;
    }

    const payload = {
      sigla,
      nombreLocal,
      direccion,
      comuna,
      region,
      pais,
      telefonoLocal,
      telefono01,
      telefono02,
      telefono03,
      telefonoRespaldo,
      marca,
      tipoLocal: 'Tradicional',
      
      // Nuevos campos de identificación
      rut,
      razonSocial,
      encargadoLocal,
      esFranquicia,
      tieneUps,
      servicioAudio,
      
      // Telefonia por proveedor con anexos múltiples
      claroNumero,
      claroTarifa,
      claroAnexo1,
      claroAnexo2,
      claroAnexo3,
      gtdNumero,
      gtdTarifa,
      gtdAnexo1,
      gtdAnexo2,
      gtdAnexo3,
      entelNumero,
      entelTarifa,
      entelAnexo1,
      entelAnexo2,
      entelAnexo3,
      movistarNumero,
      movistarTarifa,
      movistarAnexo1,
      movistarAnexo2,
      movistarAnexo3,
      
      // Red
      dispositivoRed,
      enlacePrincipal,
      enlaceSecundario,
      enlaceTercero,
      switchCantidad,
      switchPuertos,
      apCantidad,
      teltonikaMarca,
      teltonikaModelo,
      
      // Hardware con Proxmox
      servidorPrincipalModelo,
      servidorPrincipalDisco,
      servidorPrincipalRam,
      servidorPrincipalProcesador,
      servidorPrincipalProxmox,
      servidorRespaldoModelo,
      servidorRespaldoDisco,
      servidorRespaldoRam,
      servidorRespaldoProcesador,
      servidorRespaldoProxmox,
      
      // CCTV DVR
      dvrModelo,
      dvrCapacidadDisco,
      dvrNumeroCamaras,
      dvrUsuarioAdmin,
      dvrUsuarioOperaciones,
      dvrClaveAdmin,
      dvrClaveOperaciones
    };

    try {
      console.log('=== ENVIANDO DATOS DESDE FRONTEND ===');
      console.log(JSON.stringify(payload, null, 2));
      
      const res = await api.post('/locales', payload);
      toast.success('Local creado correctamente');
      navigate('/');
    } catch (error: any) {
      console.error('Error creando local', error);
      console.error('Respuesta del servidor:', error?.response?.data);
      toast.error(error?.response?.data?.error || 'Error creando local');
    }
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">➕ Crear Nuevo Local</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECCION: IDENTIFICACION */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">🏢 Identificación</h2>
            <p className="text-sm text-blue-600 mb-4">⚠️ Todos los campos son obligatorios</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Marca / Cadena <span className="text-red-500">*</span></label>
                <select className="input" value={marca} onChange={(e) => setMarca(e.target.value)} required>
                  <option value="NIU_SUSHI">NIU SUSHI</option>
                  <option value="NIU_EXPRESS">NIU EXPRESS</option>
                  <option value="GUACAMOLE">GUACAMOLE</option>
                  <option value="KAO">KAO</option>
                  <option value="NIU_MEXICO">NIU MEXICO</option>
                </select>
              </div>
              
              <div>
                <label className="label">N° Local (Numero) <span className="text-red-500">*</span></label>
                <input 
                  className="input" 
                  value={number} 
                  onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ''))} 
                  required
                />
              </div>

              <div>
                <label className="label">Sigla (Auto-generada) <span className="text-red-500">*</span></label>
                <input className="input bg-gray-50" value={sigla} onChange={(e) => setSigla(e.target.value)} required />
                <p className="text-sm text-gray-500 mt-1">Se genera automaticamente: marca + numero</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="label">Nombre del Local <span className="text-red-500">*</span></label>
              <input className="input" value={nombreLocal} onChange={(e) => setNombreLocal(e.target.value)} 
                     placeholder="Ej: NIU SUSHI Las Condes" required />
            </div>

            {/* Información Legal y Administrativa */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Empresa (RUT - Razón Social) <span className="text-red-500">*</span></label>
                <select 
                  className="input" 
                  value={rut} 
                  onChange={(e) => {
                    const selectedEmpresa = empresasData.find(emp => emp.rut === e.target.value);
                    setRut(e.target.value);
                    setRazonSocial(selectedEmpresa ? selectedEmpresa.razonSocial : '');
                  }}
                  required
                >
                  <option value="">Seleccionar empresa...</option>
                  {empresasData.map((empresa, index) => (
                    <option key={index} value={empresa.rut}>
                      {empresa.rut} - {empresa.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Encargado del Local <span className="text-red-500">*</span></label>
                <select className="input" value={encargadoLocal} onChange={(e) => setEncargadoLocal(e.target.value)} required>
                  <option value="">Seleccionar encargado...</option>
                  {encargados.map((encargado, index) => (
                    <option key={index} value={encargado}>
                      {encargado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="label">Tipo de Local <span className="text-red-500">*</span></label>
                <select className="input" value={esFranquicia} onChange={(e) => setEsFranquicia(e.target.value)} required>
                  <option value="">Seleccionar tipo...</option>
                  <option value="FRANQUICIA">Franquicia</option>
                  <option value="PROPIO">Propio</option>
                </select>
              </div>

              <div>
                <label className="label">¿Tiene UPS? <span className="text-red-500">*</span></label>
                <select className="input" value={tieneUps ? 'SI' : 'NO'} onChange={(e) => setTieneUps(e.target.value === 'SI')} required>
                  <option value="">Seleccionar...</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <div>
                <label className="label">Servicio de Audio <span className="text-red-500">*</span></label>
                <select className="input" value={servicioAudio} onChange={(e) => setServicioAudio(e.target.value)} required>
                  <option value="">Seleccionar servicio...</option>
                  {serviciosAudio.map((servicio, index) => (
                    <option key={index} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECCION: UBICACION */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-green-700">📍 Ubicación</h2>
            <p className="text-sm text-green-600 mb-4">⚠️ Todos los campos son obligatorios</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Dirección <span className="text-red-500">*</span></label>
                <input className="input" value={direccion} onChange={(e) => setDireccion(e.target.value)} 
                       placeholder="Av. Apoquindo 1234" required />
              </div>
              <div>
                <label className="label">Comuna <span className="text-red-500">*</span></label>
                <input className="input" value={comuna} onChange={(e) => setComuna(e.target.value)} 
                       placeholder="Las Condes" required />
              </div>
              <div>
                <label className="label">Región <span className="text-red-500">*</span></label>
                <input className="input" value={region} onChange={(e) => setRegion(e.target.value)} 
                       placeholder="Metropolitana" required />
              </div>
              <div>
                <label className="label">País <span className="text-red-500">*</span></label>
                <input className="input" value={pais} onChange={(e) => setPais(e.target.value)} required />
              </div>
            </div>
          </div>

          {/* SECCION: TELEFONIA BASICA */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">📞 Telefonía Básica</h2>
            <p className="text-sm text-gray-500 mb-4">ℹ️ Todos los campos son opcionales</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label">Teléfono Local Principal</label>
                <input className="input" value={telefonoLocal} onChange={(e) => setTelefonoLocal(e.target.value)} 
                       placeholder="+56 2 2345 6789" />
              </div>
              <div>
                <label className="label">Teléfono Respaldo</label>
                <input className="input" value={telefonoRespaldo} onChange={(e) => setTelefonoRespaldo(e.target.value)} 
                       placeholder="+56 2 2345 6790" />
              </div>
              <div></div>
              <div>
                <label className="label">Teléfono 01</label>
                <input className="input" value={telefono01} onChange={(e) => setTelefono01(e.target.value)} />
              </div>
              <div>
                <label className="label">Teléfono 02</label>
                <input className="input" value={telefono02} onChange={(e) => setTelefono02(e.target.value)} />
              </div>
              <div>
                <label className="label">Teléfono 03</label>
                <input className="input" value={telefono03} onChange={(e) => setTelefono03(e.target.value)} />
              </div>
            </div>
          </div>

          {/* SECCION: TELEFONIA POR PROVEEDOR */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-red-700">📱 Telefonía por Proveedor</h2>
            <p className="text-sm text-gray-500 mb-4">ℹ️ Todos los campos son opcionales</p>
            
            {/* CLARO */}
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-3">CLARO</h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <label className="label">Número CLARO</label>
                  <input className="input" value={claroNumero} onChange={(e) => setClaroNumero(e.target.value)} />
                </div>
                <div>
                  <label className="label">Tarifa</label>
                  <input className="input" value={claroTarifa} onChange={(e) => setClaroTarifa(e.target.value)} />
                </div>
                <div>
                  <label className="label">Anexo 1</label>
                  <input className="input" value={claroAnexo1} onChange={(e) => setClaroAnexo1(e.target.value)} 
                         placeholder="1234" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 2</label>
                  <input className="input" value={claroAnexo2} onChange={(e) => setClaroAnexo2(e.target.value)} 
                         placeholder="1235" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 3</label>
                  <input className="input" value={claroAnexo3} onChange={(e) => setClaroAnexo3(e.target.value)} 
                         placeholder="1236" maxLength={4} />
                </div>
              </div>
            </div>

            {/* GTD */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">GTD</h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <label className="label">Número GTD</label>
                  <input className="input" value={gtdNumero} onChange={(e) => setGtdNumero(e.target.value)} />
                </div>
                <div>
                  <label className="label">Tarifa</label>
                  <input className="input" value={gtdTarifa} onChange={(e) => setGtdTarifa(e.target.value)} />
                </div>
                <div>
                  <label className="label">Anexo 1</label>
                  <input className="input" value={gtdAnexo1} onChange={(e) => setGtdAnexo1(e.target.value)} 
                         placeholder="1234" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 2</label>
                  <input className="input" value={gtdAnexo2} onChange={(e) => setGtdAnexo2(e.target.value)} 
                         placeholder="1235" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 3</label>
                  <input className="input" value={gtdAnexo3} onChange={(e) => setGtdAnexo3(e.target.value)} 
                         placeholder="1236" maxLength={4} />
                </div>
              </div>
            </div>

            {/* ENTEL */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">ENTEL</h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <label className="label">Número ENTEL</label>
                  <input className="input" value={entelNumero} onChange={(e) => setEntelNumero(e.target.value)} />
                </div>
                <div>
                  <label className="label">Tarifa</label>
                  <input className="input" value={entelTarifa} onChange={(e) => setEntelTarifa(e.target.value)} />
                </div>
                <div>
                  <label className="label">Anexo 1</label>
                  <input className="input" value={entelAnexo1} onChange={(e) => setEntelAnexo1(e.target.value)} 
                         placeholder="1234" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 2</label>
                  <input className="input" value={entelAnexo2} onChange={(e) => setEntelAnexo2(e.target.value)} 
                         placeholder="1235" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 3</label>
                  <input className="input" value={entelAnexo3} onChange={(e) => setEntelAnexo3(e.target.value)} 
                         placeholder="1236" maxLength={4} />
                </div>
              </div>
            </div>

            {/* MOVISTAR */}
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-3">MOVISTAR</h3>
              <div className="grid md:grid-cols-5 gap-4">
                <div>
                  <label className="label">Número MOVISTAR</label>
                  <input className="input" value={movistarNumero} onChange={(e) => setMovistarNumero(e.target.value)} />
                </div>
                <div>
                  <label className="label">Tarifa</label>
                  <input className="input" value={movistarTarifa} onChange={(e) => setMovistarTarifa(e.target.value)} />
                </div>
                <div>
                  <label className="label">Anexo 1</label>
                  <input className="input" value={movistarAnexo1} onChange={(e) => setMovistarAnexo1(e.target.value)} 
                         placeholder="1234" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 2</label>
                  <input className="input" value={movistarAnexo2} onChange={(e) => setMovistarAnexo2(e.target.value)} 
                         placeholder="1235" maxLength={4} />
                </div>
                <div>
                  <label className="label">Anexo 3</label>
                  <input className="input" value={movistarAnexo3} onChange={(e) => setMovistarAnexo3(e.target.value)} 
                         placeholder="1236" maxLength={4} />
                </div>
              </div>
            </div>
          </div>

          {/* SECCION: RED */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">🌐 Red</h2>
            
            {/* Dispositivo de Red */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-3">Dispositivo de Red</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Tipo de Dispositivo</label>
                  <select className="input" value={dispositivoRed} onChange={(e) => setDispositivoRed(e.target.value)}>
                    <option value="UDM">UDM</option>
                    <option value="USG">USG</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div></div>
              </div>
            </div>

            {/* Enlaces */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Enlaces de Internet</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Enlace Principal</label>
                  <input className="input" value={enlacePrincipal} onChange={(e) => setEnlacePrincipal(e.target.value)} 
                         placeholder="Ej: Fibra Óptica" />
                </div>
                <div>
                  <label className="label">Enlace Secundario (Chip)</label>
                  <input className="input" value={enlaceSecundario} onChange={(e) => setEnlaceSecundario(e.target.value)} 
                         placeholder="Ej: 4G Movistar" />
                </div>
                <div>
                  <label className="label">Enlace Tercero</label>
                  <input className="input" value={enlaceTercero} onChange={(e) => setEnlaceTercero(e.target.value)} 
                         placeholder="Ej: Starlink" />
                </div>
              </div>
            </div>

            {/* Switch */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Switch</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Cantidad de Switch</label>
                  <select className="input" value={switchCantidad} onChange={(e) => setSwitchCantidad(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5 o más</option>
                  </select>
                </div>
                <div>
                  <label className="label">Puertos por Switch</label>
                  <select className="input" value={switchPuertos} onChange={(e) => setSwitchPuertos(e.target.value)}>
                    <option value="6">6 puertos</option>
                    <option value="8">8 puertos</option>
                    <option value="12">12 puertos</option>
                    <option value="16">16 puertos</option>
                    <option value="24">24 puertos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AP y Teltonika */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Access Points */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">Access Points (AP)</h3>
                <div>
                  <label className="label">Cantidad de AP</label>
                  <input className="input" value={apCantidad} onChange={(e) => setApCantidad(e.target.value)} 
                         placeholder="Ej: 2, 3, 4..." />
                </div>
              </div>

              {/* Teltonika */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">Teltonika</h3>
                <div className="space-y-3">
                  <div>
                    <label className="label">Marca Teltonika</label>
                    <input className="input" value={teltonikaMarca} onChange={(e) => setTeltonikaMarca(e.target.value)} 
                           placeholder="Ej: Teltonika" />
                  </div>
                  <div>
                    <label className="label">Modelo</label>
                    <input className="input" value={teltonikaModelo} onChange={(e) => setTeltonikaModelo(e.target.value)} 
                           placeholder="Ej: RUT240, RUT950..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Clave WiFi Interna */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-3">📶 WiFi Interna</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Clave WiFi Interna</label>
                  <input className="input" value={claveWifiInterna} onChange={(e) => setClaveWifiInterna(e.target.value)} 
                         type="text" placeholder="Ingresa la contraseña de WiFi" />
                </div>
              </div>
            </div>
          </div>

          {/* SECCION: HARDWARE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">💻 Hardware</h2>
            <p className="text-sm text-gray-500 mb-4">ℹ️ Todos los campos son opcionales</p>
            
            {/* Servidor Principal */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Servidor Principal</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Modelo</label>
                  <input className="input" value={servidorPrincipalModelo} 
                         onChange={(e) => setServidorPrincipalModelo(e.target.value)} />
                </div>
                <div>
                  <label className="label">Disco</label>
                  <input className="input" value={servidorPrincipalDisco} 
                         onChange={(e) => setServidorPrincipalDisco(e.target.value)} />
                </div>
                <div>
                  <label className="label">RAM</label>
                  <input className="input" value={servidorPrincipalRam} 
                         onChange={(e) => setServidorPrincipalRam(e.target.value)} />
                </div>
                <div>
                  <label className="label">Procesador</label>
                  <input className="input" value={servidorPrincipalProcesador} 
                         onChange={(e) => setServidorPrincipalProcesador(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label flex items-center gap-2">
                    <input type="checkbox" checked={servidorPrincipalProxmox} 
                           onChange={(e) => setServidorPrincipalProxmox(e.target.checked)} />
                    <span>¿Tiene Proxmox?</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Servidor Respaldo */}
            <div className="p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Servidor Respaldo</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Modelo</label>
                  <input className="input" value={servidorRespaldoModelo} 
                         onChange={(e) => setServidorRespaldoModelo(e.target.value)} />
                </div>
                <div>
                  <label className="label">Disco</label>
                  <input className="input" value={servidorRespaldoDisco} 
                         onChange={(e) => setServidorRespaldoDisco(e.target.value)} />
                </div>
                <div>
                  <label className="label">RAM</label>
                  <input className="input" value={servidorRespaldoRam} 
                         onChange={(e) => setServidorRespaldoRam(e.target.value)} />
                </div>
                <div>
                  <label className="label">Procesador</label>
                  <input className="input" value={servidorRespaldoProcesador} 
                         onChange={(e) => setServidorRespaldoProcesador(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label flex items-center gap-2">
                    <input type="checkbox" checked={servidorRespaldoProxmox} 
                           onChange={(e) => setServidorRespaldoProxmox(e.target.checked)} />
                    <span>¿Tiene Proxmox?</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECCION: CCTV - CONFIGURACION DVR */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-pink-700">📹 CCTV - Configuración DVR</h2>
            <p className="text-sm text-pink-600 mb-4">⚠️ Todos los campos son obligatorios</p>
            
            {/* DVR Principal */}
            <div className="p-4 bg-pink-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Modelo DVR <span className="text-red-500">*</span></label>
                  <input className="input" value={dvrModelo} onChange={(e) => setDvrModelo(e.target.value)} 
                         placeholder="Ej: Hikvision DS-7208" required />
                </div>
                <div>
                  <label className="label">Capacidad Disco <span className="text-red-500">*</span></label>
                  <input className="input" value={dvrCapacidadDisco} onChange={(e) => setDvrCapacidadDisco(e.target.value)} 
                         placeholder="Ej: 2TB, 4TB" required />
                </div>
                <div>
                  <label className="label">Número de Cámaras <span className="text-red-500">*</span></label>
                  <input className="input" value={dvrNumeroCamaras} onChange={(e) => setDvrNumeroCamaras(e.target.value)} 
                         placeholder="Ej: 4, 8, 16" required />
                </div>
                <div></div>
              </div>

              {/* Usuarios y Contraseñas DVR */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-pink-800">Usuario Administrador</h4>
                  <div>
                    <label className="label">Usuario Admin <span className="text-red-500">*</span></label>
                    <input className="input" value={dvrUsuarioAdmin} onChange={(e) => setDvrUsuarioAdmin(e.target.value)} 
                           placeholder="admin" required />
                  </div>
                  <div>
                    <label className="label">Contraseña Admin <span className="text-red-500">*</span></label>
                    <input className="input" type="text" value={dvrClaveAdmin} onChange={(e) => setDvrClaveAdmin(e.target.value)} 
                           placeholder="Ingresa la contraseña" required />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-pink-800">Usuario Operaciones</h4>
                  <div>
                    <label className="label">Usuario Operaciones <span className="text-red-500">*</span></label>
                    <input className="input" value={dvrUsuarioOperaciones} onChange={(e) => setDvrUsuarioOperaciones(e.target.value)} 
                           placeholder="operador" required />
                  </div>
                  <div>
                    <label className="label">Contraseña Operaciones <span className="text-red-500">*</span></label>
                    <input className="input" type="text" value={dvrClaveOperaciones} onChange={(e) => setDvrClaveOperaciones(e.target.value)} 
                           placeholder="Ingresa la contraseña" required />
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* BOTONES DE ACCION */}
          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={() => navigate('/')} 
                    className="btn bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" 
                    className="btn btn-primary px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Crear Local Completo
            </button>
          </div>
        </form>

        {/* Informacion de timestamps automaticos */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            ℹ️ <strong>Nota:</strong> Los campos de fecha de creación y última edición se registran automáticamente cuando se agrega o modifica un local.
          </p>
        </div>
      </div>
    </div>
  );
}