const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use( fileUpload({ useTempFiles: true, 
    tempFileDir: 'tmp/',
    createParentPath: true
}) );



app.put('/upload/:tipo/:id', (req, res) => {
    
    let tipo = req.params.tipo;
    let id = req.params.id;



    //============
    // Manejo de err si no trae archivos el form
    //============
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //============
    // Validar tipo
    //============

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son: ' + tiposValidos.join(', '),
                tipo
            }
        });
    }


    //============
    // Extensiones permitidas
    //============
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    //============
    // Obtener archivo del form
    //============
    let uploadedFile = req.files.file;

    let nombreArchivoPartido = uploadedFile.name.split('.');
    let extension = nombreArchivoPartido[nombreArchivoPartido.length - 1];

    //============
    // Manejo de extension no valida
    //============
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //============
    // Cambio de nombre del archivo
    //============

    let nombreArchivo = `${id}-${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}-${new Date().getTime()}.${extension}`


//============
// Mueve el archivo del form al directorio especificado en el path
//============

    let pathToFile = `uploads/${tipo}/${id}/${nombreArchivo}`;

    uploadedFile.mv( pathToFile, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,  
                err
            });
        }

        //============
        // Imagen cargada
        //============
        if (tipo === 'usuarios') {
            
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            
            imagenProducto(id, res, nombreArchivo);
        }
        else{
            console.log("Sepa");
            
        }
    });

});

//============
// Validaciones de la imagen de usuario
//============

const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borraCarpetaIdInvalido(id, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borraCarpetaIdInvalido(id, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        if (usuarioDB.img) {
            borraArchivo(id, usuarioDB.img, 'usuarios');
        }


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })

    });

};

//============
// Validaciones de la imagen de producto
//============

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borraCarpetaIdInvalido(id, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borraCarpetaIdInvalido(id, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        if (productoDB.img) {
            borraArchivo(id, productoDB.img, 'productos');
        }


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    });
};

//============
// Borra recursivamente la carpeta si hay un error
//============
const borraCarpetaIdInvalido = (id, tipo) => {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${id}`); 

        if (fs.existsSync(pathImg)){
            fs.rmdirSync (pathImg,  { recursive: true });
        }
}

//============
// Borra el archivo si ya existia uno en la db
//============

const borraArchivo = (id, nombreImagen, tipo ) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${id}/${nombreImagen}`); 

        if (fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg);
        }
};

module.exports = app;