const { Schema, model } = require('mongoose');


const PostulacionSchema = Schema({
    idUser: {
        type: String,
    },
    idPerro : {
        type: String,
    },
    idSitter : {
        type: String,
    },
    state : {
        type: String,
        default: 'pendiente'
    }
});

module.exports = model('Postulacion', PostulacionSchema );
