const express = require('express');
const app = express();



// Rutas del usuario
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));


module.exports = app;