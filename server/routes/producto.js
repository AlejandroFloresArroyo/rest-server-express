const express = require('express');

const { verificaToken } = require('../middlewares/auth');


let app = express();
let Producto = require('../models/producto');

let estadoTrue = {
    disponible: true
}


// Trae todos los productos, populate usuarios y categorias, paginado
app.get('/producto', verificaToken,(req, res) => {

    let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

    Producto.find( estadoTrue )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .exec((err, productos) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            } 

            Producto.countDocuments( estadoTrue, (err, conteo) => {
                
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });

        });

});


// Trae productos por id, populate usuarios y categorias
app.get('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) =>{
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });

        });
});
    

// Crea un producto, hay que registrar que usuario lo mando y una categoría del listado
app.post('/producto', verificaToken,(req, res) => {
    
    let body = req.body;
    
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
        disponible: body.disponible
    });

    producto.save((err, productoDB) =>{
      
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
        

    });
    
});


// Actualiza el producto por id
app.put('/producto/:id', verificaToken,(req, res) => {
    
    let id = req.params.id;

    let body = req.body;

    let productoActualizado = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, productoActualizado,{ new: true, runValidators: true ,useFindAndModify: false, context: 'query' }, (err, producto) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            producto
        });
    });
    
    
});



// Borrar el producto por id (Solo deshabilita)  
app.delete('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    let productoEliminado = {
        disponible: false,
    }

    Producto.findByIdAndUpdate(id, productoEliminado,{ new: true, runValidators: true ,useFindAndModify: false, context: 'query' }, (err, producto) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        return res.json({
            ok: true,
            producto
        });
    });
    
});



module.exports = app;