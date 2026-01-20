import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createVisita, getVisitas, getReporteActividad } from '../controllers/visitaController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticateToken, createVisita);
router.get('/', authenticateToken, getVisitas);
router.get('/reporte', authenticateToken, requireAdmin, getReporteActividad);

// Estadísticas de visitas por local
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { mes, anio } = req.query;
    
    let whereClause: any = {};
    
    // Filtros de fecha si se proporcionan
    if (mes && anio) {
      const startDate = new Date(parseInt(anio as string), parseInt(mes as string) - 1, 1);
      const endDate = new Date(parseInt(anio as string), parseInt(mes as string), 0, 23, 59, 59);
      
      whereClause.fecha = {
        gte: startDate,
        lte: endDate
      };
    }
    
    const visitas = await prisma.visita.findMany({
      where: whereClause,
      include: {
        local: {
          select: {
            id: true,
            sigla: true,
            nombreLocal: true
          }
        }
      },
      orderBy: { fecha: 'desc' }
    });

    // Agrupar por local y calcular estadísticas
    const statsMap = new Map<number, any>();
    
    visitas.forEach(visita => {
      const localId = visita.localId;
      if (!statsMap.has(localId)) {
        statsMap.set(localId, {
          localId: visita.local.id,
          localSigla: visita.local.sigla,
          localNombre: visita.local.nombreLocal,
          cantidadVisitas: 0,
          ultimaVisita: null
        });
      }
      const stat = statsMap.get(localId)!;
      stat.cantidadVisitas++;
      if (!stat.ultimaVisita) {
        stat.ultimaVisita = visita.fecha.toISOString();
      }
    });

    const stats = Array.from(statsMap.values());
    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo estadísticas de visitas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;