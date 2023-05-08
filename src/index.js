const express = require('express');
const app = express();
const morgan = require('morgan');


//settings
app.set('port', process.env.PORT ||3000);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//routes 


//starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${3000}`);
});