import createHttpError from 'http-errors';
import Route from '../Schemes/Route.js';
import RouteOrder from '../Schemes/Route_order.js';
import UserToAccept from '../Schemes/Users_to_accept.js';
import User from '../Schemes/user.js';
import Vehicle from '../Schemes/Vehicle.js';


// Función para obtener las rutas del usuario autenticado (lista)
export const index = async (req, res, next) =>  {
  try {
    const routes = await Route.find({ user_id: req.payload.user._id });
    res.json({'Rutas disponibles' : routes});
  } catch (err) {
    next(createHttpError(500, err.message));
  }
}

// Funcion para obtener las ordenes de ruta del usuario autenticado (lista)
export async function orders_route(req, res, next) {
  try {
    // Buscar la ruta activa del conductor actual
    const route = await Route.findOne({
      user_id: req.payload.user._id,
      status: true
    });

    if (route) {
      // Buscar la primera orden de ruta asociada a la ruta activa
      const routeOrder = await RouteOrder.findOne({
        route_id: route._id
      });

      return res.status(200).json(routeOrder);
    }

    return res.status(404).json();
  } catch (error) {
    next(createHttpError(500, error.message));
  }
}

// Funcion para crear una orden de ruta (lista)
export const crearOrden = async (req, res, next) => {
  try {
    const { route_id, vehicle_id, seats, hour } = req.body;
  
    // Actualizar el estado de la ruta a activo
    const route = await Route.findById(route_id);
    if (!route) {
      next(createHttpError(404, 'No se encontró la ruta'));
    }
    route.status = true;
    await route.save();
  
    // Crear una nueva orden de ruta
    const newOrder = new RouteOrder({
      status: 'activo',
      route_id: route_id,
      vehicle_id: vehicle_id,
      seats: parseInt(seats),
      users: [],
      hour: hour
    });
    await newOrder.save();
  
    return res.status(200).json(newOrder);
  } catch (error) {
    next(createHttpError(500, error.message));
  }
}
  
export async function desactivar(req, res, next){
  try {
    const order = await RouteOrder.findOneAndDelete({ _id: req.body.orden_ruta_id });
    
    if (!order) {
      next(createHttpError(404, 'No se encontró la orden de ruta'));
    }

    const userToAccept = await UserToAccept.find({ route_order_id: order._id });
    const route = await Route.findOneAndUpdate({ _id: req.body.route_id }, { status: false }, { new: true });
    if (!route) {
      return res.status(404).json({ error: 'La ruta especificada no existe.' });
    }

    for (const userToAccept of UserToAccept) {
      const accept = await UserToAccept.findOneAndDelete({ _id: usuario._id });
      const user = await User.findOneAndUpdate(
        { _id: accept.user_receive_id },
        { $set: { status: { cola: false, orden_ruta_id: null } } },
        { new: true }
      );
    }

    return res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al desactivar la orden de ruta.' });
  }
};

// Función para obtener los detalles de la orden de ruta activa (lista)
export const detalles_orden_activa = async (req, res, next) => {
  try {
    // Busca la ruta activa del usuario actual
    const route = await Route.findOne({ user_id: req.payload.user._id, status: true });

    if (!route) {
      // Si no hay ruta activa, se retorna un mensaje de error
      next(createHttpError(404, 'No hay ruta activa para este usuario.'));
    }

    // Busca la orden de ruta activa para la ruta encontrada
    const routeOrder = await RouteOrder.findOne({ route_id: route._id, status: 'activo' })
      .populate('route_id')
      .populate('vehicle_id');

    if (!routeOrder) {
      // Si no hay orden de ruta activa, se retorna un mensaje de error
      next(createHttpError(404, 'No hay orden de ruta activa para esta ruta.'));
    }

    // Retorna los detalles de la orden de ruta activa
    return res.json({ routeOrder });
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};
  
export async function obtener_usuarios_por_aceptar(req, res){
  try {
    const userToAccept = await UserToAccept.find({
      route_order_id: req.body.order_id
    }).populate('User');
    return res.json(userToAccept);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export async function agregar_usuario_orden(req, res){
  try {
    const { route_order_id } = req.body;
    const user = req.payload.user;

    // Recupera la orden de ruta
    const routeOrder = await RouteOrder.findById(route_order_id);

    // Verifica si hay suficientes asientos disponibles
    if (routeOrder.seats === 0) {
      return res.status(400).json({ error: 'Usuarios Completos' });
    }

    // Agrega al usuario a la orden de ruta y actualiza los asientos
    const users = [...routeOrder.users, user];
    const seats = routeOrder.seats - 1;
    await RouteOrder.updateOne({ users, seats });

    // Actualiza el perfil del usuario
    const userconsult = await User.findById(user._id);
    userconsult.status = { cola: 'aprobado', route_order_id: routeOrder._id };
    await userconsult.save();

    // Elimina al usuario de la lista de usuarios por aceptar
    await UserToAccept.deleteOne({ user_recibe_id: userconsulta._id });

    return res.json(routeOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
  
export async function rechazar_usuario_orden(req, res){
  try {
    const user = req.body.user;

    // Eliminamos el usuario de la lista de usuarios por aceptar
    await UserToAccept.deleteOne({ user_recibe_id: user._id });

    // Modificamos el perfil del usuario
    const newObject = {
      cola: false,
      orden_ruta_id: ''
    };
    await User.findOneAndUpdate(
      { _id: user._id },
      { status: newObject }
    );

    return res.json({ message: 'Usuario rechazado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ha ocurrido un error al rechazar el usuario' });
  }
};
  
export async function cancelarle_cola_usuario(req, res) {
  const { route_order_id, user_id } = req.body;

  try {
    // Buscar la ruta correspondiente
    const orders = await RouteOrder.findById(orden_ruta_id);

    // Buscar al usuario correspondiente
    const user = await User.findById(user_id);

    // Crear un nuevo array de usuarios sin el usuario que se está eliminando
    const newArray = orders.users.filter((value) => value._id !== user_id);

    // Actualizar la lista de usuarios en la ruta
    orders.users = newArray;

    // Actualizar el estatus del usuario
    user.status = {
      cola: false,
      route_order_id: null,
    };
    await user.save();

    // Incrementar el número de asientos disponibles en la ruta
    orders.seats += 1;
    await orders.save();

    // Devolver la ruta actualizada en la respuesta HTTP
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function cancelar_cola_pasajero_aprobado(req, res) {
  try {
    const routeOrderId = req.body.route_order_id;
    const userId = req.body.user_id;

    // Buscar la orden de la ruta
    const order = await RouteOrder.findById(ordenRutaId);

    // Buscar al usuario
    const user = await User.findById(userId);

    // Eliminar al usuario de la cola
    const newUsers = order.users.filter(user => user._id !== userId);
    order.users = newUsers;

    // Actualizar el estatus del usuario
    user.status.cola = false;
    user.status.route_order_id = null;
    await user.save();

    // Incrementar el número de asientos disponibles
    order.seats += 1;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error' });
  }
}
  
export async function modificar_cola_conductor(req, res) {
  try {
    const order = await RouteOrder.findById(req.body.orden_ruta_id);
    const route = await Routes.findById(orden.ruta_id);
    route.status = false;
    if (req.body.flag === 'cancelado') {
      orden.status = 'cancelado';
    } else {
      orden.status = 'completado';
    }
    await order.save();
    await route.save();

    for (const value of order.users) {
      const user = await User.findById(value._id);
      user.status.cola = false;
      user.status.orden_ruta_id = null;
      if (req.body.flag === 'completado') {
        user.score += 1;
        await user.save();
      }
    }

    const driver = await User.findById(route.user_id);
    driver.score += 3;
    await driver.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Función para crear una ruta (lista)
export const crear_ruta = async (req, res, next) => {
  try {
    // Crear la ruta
    const route = new Route({
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      user_id: req.payload.user._id, // se asume que la ruta se crea con la sesión iniciada
    });

    // Guardar la ruta en la base de datos
    await route.save();
    
    res.status(201).json(route);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
  

// Función para eliminar una ruta (lista)
export const eliminar_ruta = async (req, res, next) => {
  try {

    // Verificar si la ruta tiene una orden de ruta abierta
    const route = await Route.findById(req.params.id);

    if (!route) {
      next(createHttpError(404, 'No se encontró la ruta'));
    }
    
    const orderRoute = await RouteOrder.findOne({
      route_id: route._id,
      estatus: 'activo'
    });

    if (orderRoute) {
      next(createHttpError(400, 'No puede eliminar, tiene una orden de ruta abierta'))
    }

    await route.deleteOne();

    const routes = await Route.find({ user_id: req.payload.user._id });
    res.status(200).json({'Rutas Disponibles': routes});
  } catch (error) {
      next(createHttpError(500, error.message));
  }
};
  