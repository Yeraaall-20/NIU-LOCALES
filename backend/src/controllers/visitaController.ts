import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVisita = async (req: Request, res: Response) => {
  try {
    const { localId, descripcion, tipoVisita, duracion, observaciones } = req.body;
    const userId = req.user!.userId;

    const visita = await prisma.visita.create({
      data: {
        userId,
        localId: parseInt(localId),
        descripcion,
        tipoVisita,
        duracion: duracion ? parseInt(duracion) : null,
        observaciones
      },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true
          }
        },
        local: {
          select: {
            nombreLocal: true,
            sigla: true
          }
        }
      }
    });

    res.status(201).json(visita);
  } catch (error) {
    console.error('Error creando visita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getVisitas = async (req: Request, res: Response) => {
  try {
    const { mes, año, userId } = req.query;
    
    let whereClause: any = {};

    // Si no es admin, solo puede ver sus propias visitas
    if (req.user?.role !== 'ADMIN') {
      whereClause.userId = req.user!.userId;
    } else if (userId) {
      whereClause.userId = parseInt(userId as string);
    }

    // Filtros de fecha si se proporcionan
    if (mes && año) {
      const startDate = new Date(parseInt(año as string), parseInt(mes as string) - 1, 1);
      const endDate = new Date(parseInt(año as string), parseInt(mes as string), 0, 23, 59, 59);
      
      whereClause.fecha = {
        gte: startDate,
        lte: endDate
      };
    }

    const visitas = await prisma.visita.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true
          }
        },
        local: {
          select: {
            nombreLocal: true,
            sigla: true,
            direccion: true,
            comuna: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    res.json(visitas);
  } catch (error) {
    console.error('Error obteniendo visitas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getReporteActividad = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const now = new Date();
    const mesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const finMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Obtener estadísticas de visitas del mes anterior
    const visitasDelMes = await prisma.visita.findMany({
      where: {
        fecha: {
          gte: mesAnterior,
          lte: finMesAnterior
        }
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        },
        local: {
          select: {
            nombreLocal: true,
            sigla: true
          }
        }
      }
    });

    // Agrupar por usuario
    const reportePorUsuario = visitasDelMes.reduce((acc: any, visita) => {
      const userId = visita.userId;
      if (!acc[userId]) {
        acc[userId] = {
          usuario: visita.user,
          totalVisitas: 0,
          tiposVisita: {},
          localesVisitados: new Set(),
          tiempoTotal: 0
        };
      }
      
      acc[userId].totalVisitas++;
      acc[userId].tiposVisita[visita.tipoVisita] = (acc[userId].tiposVisita[visita.tipoVisita] || 0) + 1;
      acc[userId].localesVisitados.add(visita.local.sigla);
      acc[userId].tiempoTotal += visita.duracion || 0;
      
      return acc;
    }, {});

    // Convertir Set a Array para serialización
    Object.keys(reportePorUsuario).forEach(userId => {
      reportePorUsuario[userId].localesVisitados = Array.from(reportePorUsuario[userId].localesVisitados);
    });

    const reporte = {
      mes: mesAnterior.getMonth() + 1,
      año: mesAnterior.getFullYear(),
      totalVisitas: visitasDelMes.length,
      reportePorUsuario: Object.values(reportePorUsuario),
      fechaGeneracion: new Date()
    };

    res.json(reporte);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};