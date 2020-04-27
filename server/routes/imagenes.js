const express = require('express');
const fs = require('fs');
const {verificaTokenImg} = require('../middlewares/auth');

const path = require('path');

let app = express();

app.get('/imagen/:tipo/:id/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let id = req.params.id;


    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    let pathToImg = path.resolve(__dirname, `../../uploads/${tipo}/${id}/${img}`);

    if (fs.existsSync(pathToImg)) {
        res.sendFile(pathToImg);
    } else
    {
        res.sendFile(noImagePath);
    }

});







module.exports = app;