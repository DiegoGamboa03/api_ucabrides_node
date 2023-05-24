import Vehicle from '../Schemes/Vehicle.js';

// Función para obtener los vehículos del usuario autenticado
export const index = async (req, res) =>  {
  try {
    // Buscar los vehículos por el ID del usuario autenticado
    const vehicles = await Vehicle.find({ user_id: req.payload.user._id });

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los vehículos' });
  }
}

export const createVehicle = async (req, res) => {
    try {
      // Crear un nuevo vehículo con los datos del cuerpo de la solicitud
      const vehicle = new Vehicle({
        marca: req.body.marca,
        color: req.body.color,
        placa: req.body.placa,
        user_id: req.payload.user._id
      });
  
      // Guardar el vehículo en la base de datos
      await vehicle.save();
  
      return res.json(vehicle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear el vehículo' });
    }
}

export const updateVehicle = async (req, res) => {
    try {
      // Buscar el vehículo por su ID
      const vehicle = await Vehicle.findById(req.params.id);
  
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
  
      // Actualizar los campos del vehículo
      vehicle.marca = req.body.marca.toUpperCase();
      vehicle.color = req.body.color;
      vehicle.placa = req.body.placa.toUpperCase();
  
      await vehicle.save();
  
      return res.json(vehicle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
}
  
export const deleteVehicle = async (req, res) =>  {
    try {
      // Buscar y eliminar el vehículo por su ID
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
  
      // Devolver todos los vehículos restantes
      const vehicles = await Vehicle.find();
      return res.json(vehicles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
  }
      