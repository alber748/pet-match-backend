const Dog = require('../models/Dog');
const response = require('express');

const crearPerro = async(data, url) => { 

      try {            
            const dbDog = new Dog( data );
            dbDog.files = url;
            await dbDog.save();
            return Dog.db
      } catch (error) {
            return error;
      }
}

const deletePerro = async(req, res = response) => {
      const { id } = req.body;
      try {
            
            const dbDog = await Dog.findById( id );

            if ( !dbDog ) {
                  return res.status(400).json({
                        ok: false,
                        msg: 'El perro no existe'
                  });
            }

            await Dog.findByIdAndDelete( id );
            return res.status(200).json({
                  ok: true,
                  msg: 'Perro eliminado correctamente'
            });
            
      } catch (error) {
            console.log(error);
            return res.status(500).json({
                  ok: false,
                  msg: 'Por favor hable con el administrador'
            });
      }
}

const editPerro = async(req, res = response) => {
      const { id, name, idPersona, edad, peso, situacion, descripcion, fotos } = req.body;
      try {
            const dbDog = await Dog.findById( id );
            if ( !dbDog ) {
                  return res.status(400).json({
                        ok: false,
                        msg: 'El perro no existe'
                  });
            }
            dbDog.name = name;
            dbDog.idPersona = idPersona;
            dbDog.edad = edad;
            dbDog.peso = peso;
            dbDog.situacion = situacion;
            dbDog.descripcion = descripcion;
            dbDog.fotos = fotos;
            await dbDog.save();
            return res.status(200).json({
                  ok: true,
                  msg: 'Perro actualizado correctamente'
            });
      } catch (error) {
            console.log(error);
            return res.status(500).json({
                  ok: false,
                  msg: 'Por favor hable con el administrador'
            });
      }
}
const getDogs = async (req, res = response) => {
      const idUser = req.query.idUser;
      console.log(idUser);
      try {
          const dbDogs = await Dog.find({ idPersona: idUser });
          return res.status(200).json({
              ok: true,
              dogs: dbDogs
          });
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              ok: false,
              msg: 'Por favor hable con el administrador'
          });
      }
  }
  
  
  const getDogById = async (req, res = response) => {
      const id = req.query.id;
      try {
          const dbDog = await Dog.findById(id);
          return res.status(200).json({
              ok: true,
              dog: dbDog
          });
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              ok: false,
              msg: 'Por favor hable con el administrador'
          });
      }
  
  }

const getAllDogs = async(req, res = response) => {
      try {
            const dbDogs = await Dog.find();
            return res.status(200).json({
                  ok: true,
                  dogs: dbDogs
            });
      } catch (error) {
            console.log(error);
            return res.status(500).json({
                  ok: false,
                  msg: 'Por favor hable con el administrador'
            });
      }

}

module.exports = {
      crearPerro,
      deletePerro,
      editPerro,
      getDogs,
      getAllDogs,
      getDogById
}