import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Obtener notas de un local específico
router.get('/:localId', authenticateToken, async (req, res) => {
  try {
    const { localId } = req.params;

    const notas = await prisma.nota.findMany({
      where: { localId: parseInt(localId) },
      include: {
        createdUser: {
          select: { id: true, nombre: true, apellido: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(notas || []);
  } catch (error) {
    console.error('Error obteniendo notas del local:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva nota
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { localId, contenido, tipo, fechaProgramada } = req.body;
    const userId = (req as any).user.userId;

    if (!localId || !contenido) {
      return res.status(400).json({ error: 'localId y contenido son requeridos' });
    }

    const nota = await prisma.nota.create({
      data: {
        localId: parseInt(localId),
        contenido,
        tipo: tipo || 'TECNICO',
        fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : null,
        createdBy: userId
      },
      include: {
        createdUser: {
          select: { id: true, nombre: true, apellido: true, email: true, role: true }
        }
      }
    });

    res.status(201).json(nota);
  } catch (error) {
    console.error('Error creando nota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar nota
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido, fechaProgramada, completada } = req.body;

    const nota = await prisma.nota.update({
      where: { id: parseInt(id) },
      data: {
        contenido: contenido || undefined,
        fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : undefined,
        completada: completada !== undefined ? completada : undefined,
        updatedAt: new Date()
      },
      include: {
        createdUser: {
          select: { id: true, nombre: true, apellido: true, email: true, role: true }
        }
      }
    });

    res.json(nota);
  } catch (error) {
    console.error('Error actualizando nota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar nota
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.nota.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Nota eliminada' });
  } catch (error) {
    console.error('Error eliminando nota:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
