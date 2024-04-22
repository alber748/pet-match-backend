const { Schema, model } = require('mongoose');


const DogSchema = Schema({
    name: {
        type: String,
        required: true
    },
    idPersona: {
        type: Number,
    },
    edad: {
        type: String,
        required: true,
    },
    peso: {
        type: String,
        required: true,
    },
    situacion: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true
    },
    files : {
        type: Array,
        required: true
    },
});

module.exports = model('Dog', DogSchema );
