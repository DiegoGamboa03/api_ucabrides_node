import sosContact from '../Schemes/Emergency_contact.js';
import User from '../Schemes/user.js';

// Funcion para obtener el numero de telefono de un usuario
export async function indexPhoneNumber(req, res){
    try {
      if (!req.payload.user.phoneNumber) {
        return res.status(404).json({ error: 'No se encontró el número de teléfono del usuario' });
      }
      return res.status(200).json({ phoneNumber: req.payload.user.phoneNumber});
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Error del servidor al buscar el número de teléfono del usuario' });
    }
  };
  
//Funcion para actualizar el numero de telefono del usuario autenticado
export async function updatePhoneNumber(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.payload.user._id, { phoneNumber: req.body.phoneNumber }, { new: true });
        if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el teléfono del usuario' });
    }
}