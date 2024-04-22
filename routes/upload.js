const express = require('express');
const { upload, uploadFileToCloudinary } = require('../helpers/images');
const fs = require('fs');
const path = require('path');
const Dog = require('../models/Dog');
const { getAllDogs, getDogs } = require('../controllers/dog');
const router = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


// obetener perros segun id usuario
router.get( '/get', [
  check('idUser', 'El id del usuario es obligatorio').not().isEmpty(),
  validarCampos
], getDogs );
// obetener todos los perros 
router.get( '/get-all', [
], getAllDogs );


router.post('/', upload.array('files', 3), async function (req, res) {
  try {
    const uploadedFiles = req.files; // Array de archivos subidos por multer
    const data = req.body;

    const urls = await Promise.all(uploadedFiles.map(async (file) => {
      const buffer = file.buffer;

      // Directorio donde se guardarán los archivos localmente
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Ruta local del archivo
      const localPath = path.join(uploadDir, file.originalname);

      // Guardar el archivo localmente
      fs.writeFileSync(localPath, buffer);

      // Subir la imagen a Cloudinary
      const url = await uploadFileToCloudinary(localPath);
      
      // Eliminar la imagen local después de subirla a Cloudinary
      fs.unlinkSync(localPath);
      
      // Retornar la URL para agregarla al array de URLs
      return url;
    }));

    // Crear el perro en la base de datos con la URL de las imágenes
    const newDog = await crearPerro(data, urls);

    // Enviar respuesta con el resultado
    res.status(201).json({
      ok: true,
      msg: 'Perro(s) creado(s) correctamente',
      data: newDog
    });
  } catch (error) {
    console.error('Error al procesar archivos y subir a Cloudinary:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const crearPerro = async (data, urls) => { 
  try {            
    const dbDog = new Dog(data);
    dbDog.files = urls;
    const savedDog = await dbDog.save();
    console.log('Perro guardado correctamente:', savedDog);
    return savedDog;
  } catch (error) {
    console.error('Error al guardar el perro en la base de datos:', error);
    throw error; // Lanza el error para manejarlo en la función que llama a crearPerro
  }
}

module.exports = router;
