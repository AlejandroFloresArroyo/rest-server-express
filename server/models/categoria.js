const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria'],
  //      unique: true
    },
    estado:{
        type: Boolean,
        default: true
    },
    usuario:  { 
        type: Schema.Types.ObjectId, 
        ref: 'usuario' 
    }
});



module.exports = mongoose.model('categoria', categoriaSchema);