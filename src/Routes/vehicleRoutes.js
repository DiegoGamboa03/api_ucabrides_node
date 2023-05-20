import express from 'express'
import { createVehicle, deleteVehicle, index, updateVehicle } from '../Controllers/vehicleController.js'
import { verifyAccessToken } from '../helpers/jwt.js';

const router = express.Router();

// Rutas públicas
router.get('/vehiculos', verifyAccessToken, index)
router.post('/vehiculos', verifyAccessToken, createVehicle)
router.put('/vehiculos/:id', verifyAccessToken, updateVehicle)
router.delete('/vehiculos/:id', verifyAccessToken, deleteVehicle)

export default router