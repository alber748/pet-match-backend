const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "ds7bmb1mv",
  api_key: "871616624711812",
  api_secret: "iOrNE-FhcAHg4GB918nTC1Whv3k",
});

const uploadFileInLocalPath =  async ( req, res ) => {
  try {
    const uploadedFiles = req.files; // Array de archivos subidos por multer

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

      return url;
    }));

    // Devolver las URLs de las imágenes subidas
    res.json({ urls });
  } catch (error) {
    console.error('Error al procesar archivos y subir a Cloudinary:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

const uploadFileToCloudinary = async (fileBuffer, folder = 'perfil') => {
  try {
    const result = await cloudinary.uploader.upload(fileBuffer, { folder });

    return result.secure_url;
  } catch (error) {
    console.error('Error al subir archivo a Cloudinary:', error);
    throw new Error('Error al subir archivo a Cloudinary');
  }
};


module.exports = { uploadFileToCloudinary, upload, uploadFileInLocalPath };
