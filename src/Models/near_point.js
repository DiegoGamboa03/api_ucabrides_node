const mongoose = require('mongoose');

const Near_pointSchema = new mongoose.Schema({
  // no es necesario definir el campo _id ya que mongoose lo crea automáticamente
  // en el modelo de mongoose, se utiliza la convención camelCase para los nombres de los campos
  // por lo tanto, el campo "id" en la tabla de la base de datos será transformado a "id" en el modelo
  // el campo "timestamps" es un campo automático que se agrega a cada documento y registra la fecha de creación y actualización
}, { timestamps: true });

const Near_point = mongoose.model('Near_point', Near_pointSchema, 'punto_cercano');

module.exports = Near_point;