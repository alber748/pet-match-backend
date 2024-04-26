const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearPostulacion, getPostulaciones, deletePostulacion, changeState } = require('../controllers/postulaciones');
const router = Router();

// Crear una postulacion
router.post( '/new', [
    check('idUser', 'El idPersona es obligatorio').not().isEmpty(),
    check('idPerro', 'El idPerro es obligatorio').not().isEmpty(),
    validarCampos
], crearPostulacion );

// obtener postulaciones por usuario
router.get( '/', getPostulaciones );

// delete postulacion by id
router.post( '/delete', deletePostulacion );

// update state postulacion
router.post( '/update-state', changeState)

module.exports = router;