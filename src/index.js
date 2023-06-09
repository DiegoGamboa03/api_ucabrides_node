import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRoutes from './Routes/authRoutes.js'
import vehicleRoutes from './Routes/vehicleRoutes.js'
import routeLiftRoutes from './Routes/routeLiftRoutes.js'
import routeRoutes from './Routes/routeRoutes.js'
import phoneRoutes from './Routes/phoneRoutes.js'
import emergencyContactRoutes from './Routes/emergencyContactRoutes.js'
import connect from '../config/mongoConnection.js';
import { routeNotFound, errorHandler } from './helpers/error.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleSocketEvents } from './Helpers/socketEvents.js';

const app = express();
const PORT = process.env.PORT || 8080
const server = createServer(app);
const io = new Server(server);

//middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes 
app.use('/api', authRoutes)
app.use('/api', vehicleRoutes)
app.use('/api', routeLiftRoutes)
app.use('/api', routeRoutes)
app.use('/api', phoneRoutes)
app.use('/api', emergencyContactRoutes)

//error handlers
app.use(routeNotFound)
app.use(errorHandler)

//Sockets
let connectedClients = [] //Aqui almacenamos todos los clientes que estan actualmente conectados a la api

io.on('connection', (socket) => {

    console.log('New client connected');
  
    handleSocketEvents(socket,connectedClients);
  
    socket.on('disconnect', () => { //Una vez desconectado lo elimino de la lista de clientes conectados
      const index = connectedClients.findIndex(obj => obj.socketId === socket.id);
      connectedClients.splice(index, 1);
      console.log('Client disconnected');
    });
  });

//starting the server
server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

//Connect to the database
connect()

