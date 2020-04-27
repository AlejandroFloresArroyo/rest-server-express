const express = require('express');
let { verificaToken, verificaUserRole } = require ('../middlewares/auth');
let Categoria = require('../models/categoria');

const app = express();



let estadoTrue = {
    estado: true
}


// Muestra todas las categorías
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find( estadoTrue )
                .populate('usuario', 'nombre email')
                .sort('descripcion')
                .exec((err, categorias) => { 

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        categorias
                    });

                });
            });


// Muestra la categoría por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;


    Categoria.findById(id)
    .populate('usuario')
    .exec((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});




// Crea una nueva categoría y la regresa
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        estado: body.estado,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {

            return res.json({
                ok: true,
                categoria: categoriaDB
            });
        }

    });

});

// Modificar la categoría
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let cateriaDescripcion = {
        descripcion: body.categoria
    };

    Categoria.findByIdAndUpdate(id, cateriaDescripcion, { new: true, runValidators: true ,useFindAndModify: false, context: 'query' },(err, categoriaDB) => {
            
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        console.log(body);
        

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});



// Elimina la categoría, solo accesible para un admin
app.delete('/categoria/:id', [verificaToken, verificaUserRole], (req, res) => {

    let id = req.params.id;    

    Categoria.findByIdAndDelete(id).exec((err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                        message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;