import mongoose from 'mongoose';

const DB_URI = 'mongodb://127.0.0.1:27017/ucabrides_node';

const connect = () => {
  mongoose.connect(DB_URI, {
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