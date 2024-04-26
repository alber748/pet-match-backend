const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    photo : {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
    },
    kindRol: {
        type: String,
        required: true,
    },
    entidad: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = model('Usuario', UsuarioSchema );
