const response = require("express");
const Postulacion = require("../models/Postulacion");
const Usuario = require("../models/Usuario");
const Dog = require("../models/Dog");

const crearPostulacion = async (req, res = response) => {
  const { idPersona, idPerro } = req.body;
  try {
    const yaHayPostulacion = await Postulacion.findOne({
      idPersona,
      idPerro,
    });

    if (yaHayPostulacion) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una postulacion con esos datos",
      });
    }

    const dbPostulacion = new Postulacion(req.body);
    await dbPostulacion.save();
    return res.status(201).json({
      ok: true,
      msg: "Postulacion creada correctamente",
      postulacion: dbPostulacion
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getPostulacionesByPostulant = async (req, res = response) => {
  const idUser = req.query.idUser;

  try {
    const dbPostulaciones = await Postulacion.find({ idUser });

    if (dbPostulaciones.length === 0) {
      return res.status(200).json({
        ok: true,
        msg: "No hay postulaciones",
      });
    }

    const postulacionesCompletas = await Promise.all(
      dbPostulaciones.map(async (postulacion) => {
        const usuario = await Usuario.findById(postulacion.idUser);
        const idPerro = postulacion.idPerro;

        const perro = await Dog.findById(idPerro);
        
        return {
          estado: postulacion.state,
          id: postulacion._id,
          usuario: {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            lastname: usuario.lastname,
            phone: usuario.phone,
            location: usuario.location,
          },
          perro: {
            _id: perro.id,
            name: perro.name,
            edad: perro.edad,
            peso: perro.peso,
            situacion: perro.situacion,
            descripcion: perro.descripcion,
            files: perro.files,
          },
        };
      })
    );

    if (postulacionesCompletas.length !== 0) {
      return res.status(200).json({
        ok: true,
        postulaciones: postulacionesCompletas,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const getPostulacionesBySitter = async (req, res = response) => {

    const idSitter = req.query.idUser;
    
    try {
        const dbPostulaciones = await Postulacion.find({ idSitter });
    
        if (dbPostulaciones.length === 0) {
        return res.status(200).json({
            ok: true,
            msg: "No hay postulaciones",
        });
        }
    
        const postulacionesCompletas = await Promise.all(
        dbPostulaciones.map(async (postulacion) => {
            const usuario = await Usuario.findById(postulacion.idUser);
            const perro = await Dog.findById(postulacion.idPerro);

            return {
              estado: postulacion.state,
              id : postulacion._id,
              usuario: {
                  id: usuario.id,
                  name: usuario.name,
                  email: usuario.email,
                  lastname: usuario.lastname,
                  phone: usuario.phone,
                  location: usuario.location,
              },
              perro: {
                  _id: perro.id,
                  name: perro.name,
                  edad: perro.edad,
                  peso: perro.peso,
                  situacion: perro.situacion,
                  descripcion: perro.descripcion,
                  files: perro.files,
              },
            };
        })
      );

      if (postulacionesCompletas.length !== 0) {
        return res.status(200).json({
          ok: true,
          postulaciones: postulacionesCompletas,
        });
      }
} catch (error) {
    return res.status(500).json({
        ok: false,
        msg: "Por favor hable con el administrador",
    });
}

}

const deletePostulacion = async (req, res = response) => {
    const id = req.query.id;
    
    try {
        const dbPostulacion = await Postulacion.findOneAndDelete({ _id: id });
    
        if (!dbPostulacion) {
        return res.status(400).json({
            ok: false,
            msg: "No existe una postulacion con esos datos",
        });
        }
    
        return res.status(200).json({
            ok: true,
            msg: "Postulacion eliminada correctamente",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Por favor hable con el administrador",
        });
    }
    
}

const changeState = async (req, res = response) => {
    const id = req.query.id;
    
    try {

        const dbPostulacion = await Postulacion.findOne({ _id: id });

        if (!dbPostulacion) {
            return res.status(400).json({
                ok: false,
                msg: "No existe una postulacion con esos datos",
            });
        }

        await Postulacion.findOneAndUpdate({ _id: id }, { state: 'aceptado' });

        return res.status(200).json({
            ok: true,
            msg: "Estado de la postulacion actualizado correctamente",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Por favor hable con el administrador",
        });
    
    }
}

module.exports = {
  crearPostulacion,
  deletePostulacion,
  changeState,
  getPostulacionesBySitter,
  getPostulacionesByPostulant
};
