import express from 'express'
const router = express.Router();
import { changePassword, login, me, mis_puntos, refresh, register, register_gmail } from '../Controllers/authControllers.js'
import { verifyAccessToken } from '../helpers/jwt.js';

// Rutas públicas
router.post('/register', register);
router.post('/register/gmail', register_gmail)
router.post('/login', login)
router.post('/refresh', refresh)

// Rutas protegidas
router.post('/cambiarclave/:id', verifyAccessToken, changePassword)
router.get('/me', verifyAccessToken, me)
router.get('/mis_puntos', verifyAccessToken, mis_puntos)

export default router