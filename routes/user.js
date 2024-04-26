const { Router } = require('express');
const { check } = require('express-validator');
const { revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { cambiarContrasena, editUser, deleteUser, addPhotoUser } = require('../controllers/user');
const { upload } = require('../helpers/images');


const router = Router();


// Edit User
router.put( '/edit', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('phone', 'El telefono es obligatorio').not().isEmpty(),
    check('location', 'La locacion es obligatorio').not().isEmpty(),
    check('kindRol', 'El tipo de rol es obligatorio').not().isEmpty(),
    check('entidad', 'El tipo de entidad es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], editUser );

// delete user 
router.delete( '/delete', deleteUser );

router.post( '/add-photo', upload.single("file"), addPhotoUser );

router.post( '/cambiar-pasword', [
    check('email', 'El email es obligatorio').isEmail(),
    check('oldPassword', 'La contraseña es obligatoria').isLength({ min: 6 }),
    check('newPassword', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], cambiarContrasena );

// Validar y revalidar token
router.get( '/renew', validarJWT , revalidarToken );







module.exports = router;