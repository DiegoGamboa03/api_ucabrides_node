const RouteOrder = require('../Schemes/Route_order');

export async function ListAvailableRoutes(req, res) {
    try {
      // Buscar las órdenes de rutas activas con asientos disponibles
      const routeOrder = await RouteOrder.find({
        status: 'activo',
        seats: { $gt: 0 },
      }).populate('Routes').populate('Vehicle');
  
      return res.json({ rutas: routeOrder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al buscar las rutas disponibles' });
    }
  }
  