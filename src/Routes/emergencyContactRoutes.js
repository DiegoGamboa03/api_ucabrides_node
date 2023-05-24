import express from 'express';
import { verifyAccessToken } from '../helpers/jwt.js';
import { actualizarContacto, deleteContactoso, index, store } from '../Controllers/emergencyContactController.js';

const router = express.Router();

router.get('/contactosos', verifyAccessToken, index)
router.post('/contactosos', verifyAccessToken, store)
router.put('/contactosos/:id', verifyAccessToken, actualizarContacto)
router.delete('/contactosos/:id', verifyAccessToken, deleteContactoso)

export default router;