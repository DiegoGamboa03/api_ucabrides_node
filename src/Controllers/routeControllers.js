import RouteOrder from '../Schemes/Route_order.js';
import User from '../Schemes/user.js';
import UserToAccept from '../Schemes/Users_to_accept.js';
import Route from '../Schemes/Route.js';
import NearPoint from '../Schemes/Near_point.js';
import createHttpError from 'http-errors';

// Funcion para obtener el listado de rutas disponibles (lista)
export async function listadoRutasDisponibles(req, res) {
  try {
    // Buscar las órdenes de rutas activas con asientos disponibles
    const routeOrders = await RouteOrder.find({
      status: 'activo',
      seats: { $gt: 0 },
    }).populate('route_id').populate('vehicle_id');

    return res.json({ rutas: routeOrders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al buscar las rutas disponibles' });
  }
}

// Funcion para obtener la direccion del usuario autenticado (lista)
export async function getDireccion(req, res) {
    try {
      // Buscar al usuario autenticado por su ID
      const user = await User.findById(req.payload.user._id);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const direction = user.address;
  
      return res.json(direction);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener la dirección del usuario' });
    }
  }

  // Funcion para cambiar distancia a caminar (lista)
  export async function cambiarDistanciaCaminar(req, res) {
    try {
      const { distance } = req.body;
      const user = await User.findById(req.payload.user._id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      user.distance = distance;
      await user.save();
      return res.json({ exito: distance });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }

 // Funcion para cambiar ubicacion (lista)
 export async function cambiarUbicacion(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.payload.user._id },
        { address: req.body.LatLng },
        { new: true }
      );
      return res.json(user.address);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar la ubicación del usuario' });
    }
  }

 // Funcion para cambiar el estatus de un pasajero a activo
 export async function cambiar_estatus_usuario_activo(req, res) {
    try {
      const user = await User.findById(req.payload.user._id);
  
      // Actualizar el estado del usuario
      user.status = {
        cola: true,
        orden_ruta_id: req.params.orden_ruta_id,
      };
      await user.save();
  
      // Crear un registro en la tabla UsuariosPorAceptar
      const userToAccept = new UserToAccept({
        user_recibe_id: req.payload.user._id,
        orden_ruta_id: req.params.orden_ruta_id,
      });
      await userToAccept.save();
  
      return res.status(200).json(user.status);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al cambiar el estado del usuario.' });
    }
  }
  

  // Funcion para cambiar el estatus de un usuario a falso
  export async function cambiarEstatusUsuarioCancelar(req, res){
    try {
      // Obtener el usuario autenticado
      const user = req.payload.user;    
  
      // Obtener el id de la orden_ruta del usuario
      const routeOrderId = user.status.orden_ruta_id;
  
      // Eliminar al usuario de la lista de usuarios por aceptar
      await UserToAccept.findOneAndDelete({ user_recibe_id: user._id, orden_ruta_id: routeOrderId});
  
      // Actualizar el estatus del usuario en la base de datos
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { status: { cola: false, orden_ruta_id: null } },
        { new: true }
      );
  
      // Enviar la respuesta al cliente
      res.json(updatedUser.status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Ocurrió un error al actualizar el estatus del usuario' });
    }
  };


  // Funcion para obtener los usuarios por aceptar
  export async function usuariosPorAceptar(req, res, next) {
    try {
      // Primero obtenemos el ID de la ruta activa del conductor
      const route = await Route.findOne({ user_id: req.payload.user._id, status: true });
      if (!route) {
        return res.status(404).json({ message: 'No se encontró una ruta activa para el conductor' });
      }
  
      // Con el ID de la ruta activa conseguimos la orden de ruta activa que coincide con ese ID
      const routeOrder = await RouteOrder.findOne({ route_id: route._id, status: 'activo' });
      if (!routeOrder) {
        return res.status(404).json({ message: 'No se encontró una orden de ruta activa para la ruta' });
      }
  
      // Luego accedemos al atributo usuarios
      const users = await UserToAccept.find({ orden_ruta_id: routeOrder._id }).populate('user_recibe_id');
      return res.status(200).json({ users });
    } catch (error) {
      next(createHttpError(500, error.message))
    }
  }
  
  // Funcion para obtener el conductor de una orden de ruta
  export async function obtener_conductor(req, res, next) {
    try {
      // Obtener el ID de la ruta asociada a la orden de ruta
      const routeOrder = await RouteOrder.findById(req.params.orden_ruta_id);
      const routeId = routeOrder.route_id;
  
      // Obtener los detalles de la ruta
      const route = await Route.findById(routeId).populate('user_id');
  
      // Obtener los detalles del usuario del conductor asociado a la ruta
      const driver = await User.findById(route.user_id);
  
      // Devolver una respuesta JSON que contiene los detalles del usuario del conductor
      res.json(driver);
    } catch (error) {
      next(createHttpError(500, error.message))
    }
  }

  // Funcion para obtener los detalles de una orden de ruta abierta
  export async function obtener_detalles_orden_abierta(req, res, next){
    try {
      const details = await RouteOrder.findById(req.params.orden_ruta_id)
        .populate('route_id')
        .populate('vehicle_id');

      console.log(details);

      // Obtener los detalles de la ruta
      const route = await Route.findById(details.route_id).populate('user_id');
        
      // Obtener los detalles del usuario del conductor asociado a la ruta
      const driver = await User.findById(route.user_id).select('name email');

      res.status(200).json({ detalles_orden: details, driver });
    } catch (error) {
      next(createHttpError(500, error.message))
    }
  };
  

  // Funcion para guardar el punto más cercano 
  export async function guardarPuntoMasCerca(req, res){
    const { puntocercano } = req.body;
    
    const newNearPoint = new NearPoint({
      user_id: req.payload.user._id,
      closestPoint: puntocercano
    });
  
    try {
      await newNearPoint.save();
      return res.json(newNearPoint);
    } catch (error) {
      return res.status(500).json({ error: 'Error al guardar el punto más cercano' });
    }
  };
  
  // Funcion para obtener el punto más cercano del usuario autenticado
  export async function obtener_puntomascerca(req, res){
    try {
      const nearPoint = await NearPoint.findOne({ user_id: req.payload.user._id });
      return res.json(nearPoint);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
 // Funcion para obtener los conductores con más puntos
 export async function conductores(req, res) {
    try {
      const drivers = await User
        .find({})
        .select('name avatar puntos')
        .sort({ puntos: -1 })
        .limit(7);
        
      res.json(drivers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un problema al obtener los conductores' });
    }
  }
  