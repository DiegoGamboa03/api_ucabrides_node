import User from '../Schemes/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
  try {

    // Validar los campos del formulario
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    //Verificar si el correo electrónico ya está registrado
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Generar el nombre de usuario a partir del correo electrónico
    const username = email.split('@')[0];
    
    // Crear el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      username,
      distance: 0
    });
    await user.save();

    // Enviar respuesta exitosa
    return res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ha ocurrido un error al registrar el usuario' });
  }
};

export const register_gmail = async (req, res) => {
  try {
    // Buscamos si ya existe un usuario registrado con este correo
    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      const correo = req.body.email;
      const sub = 'ucab.edu';

      if (correo.includes(sub)) {
        // Si el correo contiene "ucab.edu", es válido
        const username = correo.split('@')[0];

        // Creamos un nuevo usuario
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          username: username,
          external_id: req.body.external_id,
          avatar: req.body.avatar,
          distance: 0,
          direccion: null,
          // status: { cola: false, orden_ruta_id: null },
          status: 1
        });

        // Guardamos el usuario en la base de datos
        const savedUser = await newUser.save();

        // Generamos un token de acceso
        const token = jwt.sign({ user: savedUser }, process.env.JWT_SECRET);

        // Enviamos la respuesta con el token y los datos del usuario
        res.status(200).json({
          message: 'Éxito al iniciar sesión',
          access_token: token,
          token_type: 'bearer',
          expires_in: 1800,
          user: savedUser
        });
      } else {
        // El correo no es válido
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    } else {
      // Actualizamos los datos del usuario
      existingUser.name = req.body.name;
      existingUser.external_id = req.body.external_id;
      existingUser.avatar = req.body.avatar;

      // Guardamos los cambios en la base de datos
      const updatedUser = await existingUser.save();

      // Generamos un token de acceso
      const token = jwt.sign({ user: updatedUser }, process.env.JWT_SECRET);

      // Enviamos la respuesta con el token y los datos del usuario
      res.status(200).json({
        message: 'Éxito al iniciar sesión',
        access_token: token,
        token_type: 'bearer',
        expires_in: 1800,
        user: updatedUser
      });
    }
  } catch (error) {
    console.log(error)
    // En caso de error, enviamos una respuesta de error
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Comprobamos si las credenciales corresponden a un nombre de usuario
    let user = await User.findOne({ username: email });
    if (!user) {
      // Si no existe un usuario con el nombre de usuario, comprobamos si existe uno con el correo electrónico
      user = await User.findOne({ email: email });
      if (!user) {
        // Si no existe un usuario con el correo electrónico o el nombre de usuario proporcionado, respondemos con un error
        return res.status(401).json({ error: 'Credenciales Incorrectas' });
      }
    }

    // Comprobamos que la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales Incorrectas' });
    }

    // Generamos un token de autenticación
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviamos la respuesta al cliente con el token de autenticación
    return res.status(200).json({
      message: 'Exito al iniciar sesion',
      access_token: token,
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        distancia: user.distancia,
        direccion: user.direccion,
        estatus: user.estatus,
        puntos: user.puntos,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Error del servidor');
  }
};


