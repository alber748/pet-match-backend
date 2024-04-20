const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

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

  module.exports = {
      cambiarContrasena,
      editUser
  }