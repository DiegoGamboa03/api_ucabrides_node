import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
      console.log('Error al conectar a MongoDB:', error);
    });
};

export default connect;