const express = require('express');
const { upload, uploadFileToCloudinary, deleteFileFromCloudinary } = require('../helpers/images');
const fs = require('fs');
const path = require('path');
const Dog = require('../models/Dog');
const { getAllDogs, getDogs, getDogById, deletePerro } = require('../controllers/dog');
const router = express.Router();


// obetener perros segun id usuario
router.get( '/get', [

], getDogs );
// obetener todos los perros 
router.get( '/get-all', [
], getAllDogs );

// obtener perro por id 
router.get( '/get-by-id', getDogById );
router.post('/delete', deletePerro);

router.post('/', upload.array('files', 3), async function (req, res) {
  try {
    const uploadedFiles = req.files;
    const data = req.body;

    const urls = await Promise.all(uploadedFiles.map(async (file) => {
      const buffer = file.buffer;

      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localPath = path.join(uploadDir, file.originalname);

      fs.writeFileSync(localPath, buffer);

      const url = await uploadFileToCloudinary(localPath);
      
      fs.unlinkSync(localPath);
      
      return url;
    }));

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

router.post('/edit-perro', upload.array('files', 3) , async function (req, res) {
  
  const data = req.body;
  const uploadedFiles = req.files; // Array de archivos subidos por multer
  const urlsToDelete = data.urlsToDel;

  try {            
    const dbDog = await Dog.findById( data.id );
    if ( !dbDog ) {
      return res.status(400).json({
        ok: false,
        msg: 'El perro no existe'
      });
    }

    // Pendiente: Eliminar las imágenes que se quitaron de cloudinary

    console.log('uploadedFiles:', uploadedFiles);

    if (uploadedFiles.length === 0) {
      
      dbDog.name = data.name;
      dbDog.idPersona = data.idPersona;
      dbDog.edad = data.edad;
      dbDog.peso = data.peso;
      dbDog.situacion = data.situacion;
      dbDog.descripcion = data.descripcion;
      await dbDog.save();
      res.status(201).json({
        ok: true,
        msg: 'Perro editado correctamente',
        data: dbDog,
      });
      return;
    } else {

      const urls = await Promise.all(uploadedFiles.map(async (file) => {
        const buffer = file.buffer;
  
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const localPath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(localPath, buffer);
        const url = await uploadFileToCloudinary(localPath);
        fs.unlinkSync(localPath);  
        return url;
      }));
  
      const existingUrls = dbDog.files;
  
      const updatedUrls = existingUrls.map((url, index) => {
        if (urlsToDelete.includes(url)) {
          return null;
        } else {
          return url;
        }
      }).filter(Boolean);
  
      // Agregar las nuevas URLs a la lista actualizada
      updatedUrls.push(...urls);


    // Actualizar la lista de imágenes del perro en la base de datos
    dbDog.files = updatedUrls;
    dbDog.name = data.name;
    dbDog.idPersona = data.idPersona;
    dbDog.edad = data.edad;
    dbDog.peso = data.peso;
    dbDog.situacion = data.situacion;
    dbDog.descripcion = data.descripcion;
    await dbDog.save();

    // Enviar respuesta con el resultado
    res.status(201).json({
      ok: true,
      msg: 'Perro editado correctamente',
      data: dbDog,
    });

    }

  }
  catch (error) {
    console.error('Error al editar el perro en la base de datos:', error);
    throw error;
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
