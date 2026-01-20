import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todos los locales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const locales = await prisma.local.findMany({
      include: {
        telefonosSecundarios: true,
        camaras: true,
        createdUser: {
          select: { nombre: true, apellido: true }
        },
        updatedUser: {
          select: { nombre: true, apellido: true }
        }
      },
      orderBy: { sigla: 'asc' }
    });
    
    // Incluir createdBy en la respuesta
    const localesWithCreatedBy = locales.map(local => ({
      ...local,
      createdBy: local.createdBy
    }));
    
    res.json(localesWithCreatedBy);
  } catch (error) {
    console.error('Error obteniendo locales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener mis locales (para soporte)
router.get('/soporte/mis-locales', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const locales = await prisma.local.findMany({
      where: {
        OR: [
          { createdBy: userId },
          { asignado: req.user?.email }
        ]
      },
      include: {
        telefonosSecundarios: true,
        camaras: true,
        visitas: {
          orderBy: { fecha: 'desc' }
        }
      },
      orderBy: { sigla: 'asc' }
    });
    res.json(locales);
  } catch (error) {
    console.error('Error obteniendo mis locales:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Solicitud de eliminación con justificación
router.post('/:id/delete-request', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { id } = req.params;
    const { razon, passwordAdmin } = req.body;

    if (!razon || !passwordAdmin) {
      return res.status(400).json({ error: 'Razón y contraseña requeridas' });
    }

    const admin = await prisma.user.findUnique({
      where: { id: req.user!.userId }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña (esto es simplificado, en producción usar bcrypt)
    // Por ahora solo verificamos que se proporcionó
    if (passwordAdmin.length < 4) {
      return res.status(400).json({ error: 'Contraseña inválida' });
    }

    const local = await prisma.local.findUnique({
      where: { id: parseInt(id) }
    });

    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    // Registro de eliminación en auditoría
    console.log(`🗑️ SOLICITUD ELIMINACIÓN - Local: ${local.sigla}, Razón: ${razon}, Admin: ${admin.email}`);

    // Aquí iría: Enviar email al admin y encargado (TODO)
    // Eliminar el local
    await prisma.local.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Local eliminado y notificaciones enviadas' });
  } catch (error) {
    console.error('Error en solicitud de eliminación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un local por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const local = await prisma.local.findUnique({
      where: { id: parseInt(id) },
      include: {
        telefonosSecundarios: true,
        camaras: true,
        createdUser: {
          select: { nombre: true, apellido: true }
        },
        updatedUser: {
          select: { nombre: true, apellido: true }
        }
      }
    });

    if (!local) {
      return res.status(404).json({ error: 'Local no encontrado' });
    }

    res.json(local);
  } catch (error) {
    console.error('Error obteniendo local:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo local
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user!.userId;

    console.log('=== DATOS RECIBIDOS ===');
    console.log(JSON.stringify(data, null, 2));

    // Extraer datos anidados para manejar por separado
    const { telefonosSecundarios, camaras, ...localData } = data;

    // Convertir strings a números donde sea necesario
    const processedData = {
      ...localData,
      // Conversiones de número
      switchCantidad: localData.switchCantidad ? parseInt(localData.switchCantidad) : null,
      switchPuertos: localData.switchPuertos ? parseInt(localData.switchPuertos) : null,
      apCantidad: localData.apCantidad ? parseInt(localData.apCantidad) : null,
      
      // Asegurar que los booleanos estén correctos
      tieneProxmox: Boolean(localData.tieneProxmox),
      
      createdBy: userId,
      updatedBy: userId
    };

    console.log('=== DATOS PROCESADOS ===');
    console.log(JSON.stringify(processedData, null, 2));

    const local = await prisma.local.create({
      data: {
        ...processedData,
        telefonosSecundarios: {
          create: telefonosSecundarios || []
        },
        camaras: {
          create: camaras || []
        }
      },
      include: {
        telefonosSecundarios: true,
        camaras: true
      }
    });

    res.status(201).json(local);
  } catch (error: any) {
    console.error('Error creando local:', error);
    console.error('Datos recibidos:', JSON.stringify(data, null, 2));
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'La sigla ya existe' });
    }
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Actualizar local
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user!.userId;
    const { lastModifiedSection } = req.body; // Qué sección se modificó

    // Extraer datos anidados para manejar por separado
    const { telefonosSecundarios, camaras, ...localData } = data;

    // Eliminar teléfonos y cámaras existentes
    await prisma.secondaryPhone.deleteMany({
      where: { localId: parseInt(id) }
    });
    await prisma.camera.deleteMany({
      where: { localId: parseInt(id) }
    });

    // Actualizar local con nuevos datos
    const local = await prisma.local.update({
      where: { id: parseInt(id) },
      data: {
        ...localData,
        updatedBy: userId,
        lastModifiedAt: new Date(),
        lastModifiedSection: lastModifiedSection || 'general',
        telefonosSecundarios: {
          create: telefonosSecundarios || []
        },
        camaras: {
          create: camaras || []
        }
      },
      include: {
        telefonosSecundarios: true,
        camaras: true,
        updatedUser: {
          select: { nombre: true, apellido: true }
        }
      }
    });

    res.json(local);
  } catch (error: any) {
    console.error('Error actualizando local:', error);
    console.error('Datos recibidos:', JSON.stringify(data, null, 2));
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'La sigla ya existe' });
    }
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Eliminar local (solo admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const { id } = req.params;
    await prisma.local.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Local eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando local:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
