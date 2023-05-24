import sosContact from '../Schemes/Emergency_contact.js';

// Definir la función index para manejar las solicitudes GET en '/contactossos'
export async function index(req, res) {
  try {
    // Buscar todos los contactosSOS asociados al usuario autenticado actualmente
    const contactossos = await sosContact.find({ user_id: req.payload.user._id });
    
    // Devolver una respuesta JSON con los contactosSOS encontrados
    return res.status(200).json(contactossos);
  } catch (error) {
    // En caso de error, devolver una respuesta con un código de estado HTTP 500
    return res.status(500).json({ error: 'Ha ocurrido un error al buscar los contactos SOS.' });
  }
};


export async function store(req, res) {
    // Comprobar si el usuario ya ha alcanzado el límite máximo de contactos permitidos (3 en este caso)
    const count = await sosContact.countDocuments({ user_id: req.payload.user._id });
    if (count >= 3) {
      return res.status(400).json({ error: 'No puede registrar, ha llegado al límite' });
    }
  
    // Comprobar si el número de teléfono ya está registrado para el usuario actual
    const existingContact = await sosContact.findOne({ telefono: req.body.telefono, user_id: req.payload.user._id });
    if (existingContact) {
      return res.status(400).json({ error: 'Ya ha registrado este numero, intente con otro' });
    }
  
    // Crear un nuevo objeto Contactoso y guardar en la base de datos
    const newSosContact = new sosContact({
      nombre: req.body.nombre,
      telefono: req.body.telefono,
      user_id: req.payload.user._id,
    });
    await newSosContact.save();
  
    // Devolver la nueva instancia recién creada
    return res.status(201).json(newSosContact);
  };
  
  export async function actualizarContacto(req, res) {
    const { name, phoneNumber } = req.body;
  
    try {
      const contact = await sosContact.findByIdAndUpdate(
        req.params.id,
        { nombre: name, telefono: phoneNumber },
        { new: true }
      );
  
      if (!contact) {
        return res.status(404).json({ error: 'No se encontró el contacto' });
      }
  
      return res.json(contact);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }

  export async function deleteContactoso(req, res) {
    try {
      const soscontact = await sosContact.findByIdAndDelete(req.params.id);
      if (!soscontact) {
        return res.status(404).json({ error: 'El contacto no fue encontrado' });
      }
      const contacts = await sosContact.find({ user_id: req.payload.user.id });
      return res.status(200).json(contacts);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error del servidor');
    }
  }
  