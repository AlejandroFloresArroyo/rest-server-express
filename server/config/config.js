
// Puerto 

process.env.PORT = process.env.PORT || 3000;

// Entorno 

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// Base de datos

let urlDB;

//if (process.env.NODE_ENV === 'dev') {
//    urlDB = 'mongodb://localhost:27017/cafe';
//} else {
    urlDB = 'mongodb+srv://ale:gatoloco2@cluster0-1vxog.mongodb.net/cafe';
//}

process.env.URLDB = urlDB;

// mongodb: //mongodb://localhost:27017/cafe

// mongodb: //mongodb+srv://ale:gatoloco2@cluster0-1vxog.mongodb.net/test