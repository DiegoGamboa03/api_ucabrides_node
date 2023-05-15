import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRoutes from './Routes/authRoutes.js'
import connect from '../config/mongoConnection.js';

const app = express();
const PORT = process.env.PORT || 8080

//middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes 
app.use('/api',authRoutes)

//starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

//Connect to the database
connect()