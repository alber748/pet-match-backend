const { Schema, model } = require('mongoose');


const PostulacionSchema = Schema({
    idUser: {
        type: String,
    },
    idPerro : {
        type: String,
    },
    state : {
        type: String,
        default: 'pendiente'
    }
});

module.exports = model('Postulacion', PostulacionSchema );
