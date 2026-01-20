import express from 'express';
import { login, createUser, getUsers, deleteUser } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.get('/users', authenticateToken, requireAdmin, getUsers);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
