const { Router } = require('express');
const { check } = require('express-validator');
const { crearPerro, deletePerro, editPerro, getDogs } = require('../controllers/dog');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Crear un nuevo perro
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('idPersona', 'El idPersona es obligatorio').not().isEmpty(),
    check('edad', 'La edad es obligatorio').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    check('situacion', 'El tipo de situacion es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatorioas').not().isEmpty(),
    check('files', 'Las fotografias son obligatorias').not().isEmpty(),
    validarCampos
],upload.array('files', 3), crearPerro );

// eliminar Perro
router.post( '/delete', [
    check('id', 'El id del perro es obligatorio').not().isEmpty(),
    validarCampos
], deletePerro );

// editar perro
router.post( '/edit', [
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('idPersona', 'El idPersona es obligatorio').not().isEmpty(),
      check('edad', 'La edad es obligatorio').not().isEmpty(),
      check('peso', 'El peso es obligatorio').not().isEmpty(),
      check('situacion', 'El tipo de situacion es obligatorio').not().isEmpty(),
      check('descripcion', 'La descripcion es obligatorioas').not().isEmpty(),
      check('fotos', 'Las fotografias son obligatorias').not().isEmpty(),
    validarCampos
], editPerro );

// obetener perros segun id usuario
router.post( '/get', [
    check('idUser', 'El id del usuario es obligatorio').isEmail(),
    validarCampos
], getDogs );

// Validar y revalidar token

module.exports = router;