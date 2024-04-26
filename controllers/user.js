const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const Dog = require('../models/Dog');
const Postulacion = require('../models/Postulacion');

const { upload, uploadFileToCloudinary } = require('../helpers/images');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Edit User
const editUser = async(req, res = response) => {
      const { email, name, lastname, phone, location, kindRol, entidad, password } = req.body;
      try {
          // Verificar el email
          const usuario = await Usuario.findOne({ email });
          
          if ( !usuario ) {
              return res.status(400).json({
                  ok: false,
                  msg: 'El usuario no existe con ese email'
              });
          }
  
          // Actualizar los datos del usuario
          usuario.name = name;
          usuario.lastname = lastname;
          usuario.phone = phone;
          usuario.location = location;
          usuario.kindRol = kindRol;
          usuario.entidad = entidad;
  
          // Si se proporciona una nueva contraseña, actualizarla
          if (password) {
              const salt = bcrypt.genSaltSync();
              usuario.password = bcrypt.hashSync(password, salt);
          }
  
          // Guardar los cambios en la base de datos
          await usuario.save();
  
          // Generar respuesta exitosa
          return res.status(200).json({
              ok: true,
              msg: 'Usuario actualizado exitosamente',
              user: usuario
          });        
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              ok: false,
              msg: 'Por favor hable con el administrador'
          });
      }
  }
  

// Edit Password User
const cambiarContrasena = async (req, res = response) => {

      const { email, oldPassword, newPassword } = req.body;
      try {
          // Buscar al usuario en la base de datos
          const dbUser = await Usuario.findOne({ email });
  
          if (!dbUser) {
              return res.status(400).json({
                  ok: false,
                  msg: 'El correo electrónico no está registrado'
              });
          }
  
          // Verificar si la contraseña anterior es válida
          const validPassword = bcrypt.compareSync(oldPassword, dbUser.password);
  
          if (!validPassword) {
              return res.status(400).json({
                  ok: false,
                  msg: 'La contraseña anterior no es válida'
              });
          }
  
          // Hashear la nueva contraseña
          const salt = bcrypt.genSaltSync();
          dbUser.password = bcrypt.hashSync(newPassword, salt);
  
          // Guardar la nueva contraseña en la base de datos
          await dbUser.save();
  
          return res.json({
              ok: true,
              msg: 'Contraseña actualizada exitosamente'
          });
  
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              ok: false,
              msg: 'Hable con el administrador'
          });
      }
  };

  const deleteUser = async (req, res = response) => {
    const id = req.query.id;
    const kindRol = req.query.kindRol;

    try {
        // Verificar la existencia del usuario
        const usuario = await Usuario.findOne({ _id: id });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        // Eliminar postulaciones y perros del usuario
        if (kindRol == '2') {
            await Postulacion.deleteMany({ idUser: id });
        } else {
            const perros = await Dog.find({ idUser: id });

            for (const perro of perros) {
                await Postulacion.deleteMany({ idPerro: perro._id });
            }

            await Dog.deleteMany({ idUser: id });
        }

        // Eliminar usuario
        await Usuario.findOneAndDelete({ _id: id });

        // Generar respuesta exitosa
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const addPhotoUser = async (req, res) => {
  try {
    const uploadedFile = req.file; // Archivo subido por multer
    const data = req.body;

    const buffer = uploadedFile.buffer;

    // Guardar la imagen localmente (opcional)
    const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        }

        const localPath = path.join(uploadDir, uploadedFile.originalname);
        fs.writeFileSync(localPath, buffer);


    // Subir la imagen a Cloudinary
    const cloudinaryUrl = await uploadFileToCloudinary(localPath);

    // Eliminar la imagen local después de subirla a Cloudinary (opcional)
    fs.unlinkSync(localPath);

    console.log('Imagen subida a Cloudinary:', cloudinaryUrl)
    mongoose.set('useFindAndModify', false);

    const userId = data.idPersona;

    console.log('data.userId', data.userId)
    // Actualizar el usuario en la base de datos con la URL de la foto de perfil
    const usuario = await Usuario.findByIdAndUpdate(userId, { photo: cloudinaryUrl }, { new: true });

    // Enviar respuesta con el resultado
    res.status(200).json({
      ok: true,
      msg: 'Foto de perfil actualizada correctamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al procesar archivo y subir a Cloudinary:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


  module.exports = {
      cambiarContrasena,
      editUser,
      deleteUser,
      addPhotoUser
  }