import express from 'express'
import { cambiarDistanciaCaminar, cambiarEstatusUsuarioCancelar, cambiarUbicacion, cambiar_estatus_usuario_activo, conductores, getDireccion, guardarPuntoMasCerca, listadoRutasDisponibles, obtener_conductor, obtener_detalles_orden_abierta, obtener_puntomascerca, usuariosPorAceptar } from '../Controllers/routeControllers.js'
import { verifyAccessToken } from '../helpers/jwt.js'

const router = express.Router()

router.get('/listado_rutas_disponibles', listadoRutasDisponibles)
router.get('/perfil_direccion', verifyAccessToken, getDireccion)
router.post('/cambiar_distancia_caminar', verifyAccessToken, cambiarDistanciaCaminar)
router.post('/cambiar_ubicacion', verifyAccessToken, cambiarUbicacion)
router.put('/cambiar_estatus_usuario_activo/:orden_ruta_id', verifyAccessToken, cambiar_estatus_usuario_activo)
router.post('/cambiar_estatus_usuario_cancelar', verifyAccessToken, cambiarEstatusUsuarioCancelar)
router.get('/obtener_usuarios_por_aceptar', verifyAccessToken, usuariosPorAceptar)
router.get('/obtener_conductor/:orden_ruta_id', verifyAccessToken, obtener_conductor)
router.get('/obtener_detalles_orden_abierta/:orden_ruta_id', verifyAccessToken, obtener_detalles_orden_abierta)
router.post('/puntomascerca', verifyAccessToken, guardarPuntoMasCerca)
router.get('/puntomascerca', verifyAccessToken, obtener_puntomascerca)
router.get('/conductores', conductores)

export default router