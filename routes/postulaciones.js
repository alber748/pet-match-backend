const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearPostulacion, deletePostulacion, changeState, getPostulacionesBySitter, getPostulacionesByPostulant } = require('../controllers/postulaciones');
const router = Router();

// Crear una postulacion
router.post( '/new', [
    check('idUser', 'El idPersona es obligatorio').not().isEmpty(),
    check('idSitter', 'El idPersona es obligatorio').not().isEmpty(),
    check('idPerro', 'El idPerro es obligatorio').not().isEmpty(),
    validarCampos
], crearPostulacion );

// obtener postulaciones por usuario
router.get( '/get-by-postulant', getPostulacionesByPostulant );

// delete postulacion by id
router.post( '/delete', deletePostulacion );

// update state postulacion
router.post( '/update-state', changeState);

// get postulacion by id de usario dueño
router.get( '/get-by-sitter', getPostulacionesBySitter);



module.exports = router;