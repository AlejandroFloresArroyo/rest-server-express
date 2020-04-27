let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categoria'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    }
});


module.exports = mongoose.model('producto', productoSchema);