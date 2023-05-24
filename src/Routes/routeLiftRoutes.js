import express from 'express';
import { verifyAccessToken } from '../helpers/jwt.js';
import { agregar_usuario_orden, crearOrden, crear_ruta, detalles_orden_activa, eliminar_ruta, index, orders_route } from '../Controllers/routeLiftController.js';

const router = express.Router();

router.post('/crear_ruta', verifyAccessToken, crear_ruta)
router.delete('/eliminar_ruta/:id', verifyAccessToken, eliminar_ruta)
router.get('/rutas', verifyAccessToken, index)
router.post('/crear_orden', verifyAccessToken, crearOrden)
router.get('/detalles_orden_activa', verifyAccessToken, detalles_orden_activa)
router.get('/ordenes_rutas', verifyAccessToken, orders_route)
router.post('/agregar_usuario_orden', verifyAccessToken, agregar_usuario_orden)


export default router;