import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true
      }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    // Remover password de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, nombre, apellido, role = 'USER' } = req.body;

    // Verificar que solo admin puede crear usuarios
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        role
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        role: true,
        activo: true,
        createdAt: true,
        _count: {
          select: {
            visitas: true,
            updatedLocales: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // No permitir que el admin se elimine a sí mismo
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    });

    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};