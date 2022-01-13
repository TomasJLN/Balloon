'use strict';

/*Primero ponemos los requires necesarios para esta sección, 1º los que no son
creados por nosotros, luego los nuestros */
/** Requirements **/
const getDB = require('../../database/getDB');

/* Creamos la función controller la cual vamos a llamar en el server.js */
const controllerTemplate = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    /*Aquí destructuring de los parámetros necesarios que trae el body */
    const { losParametrosQueNecesitamosDelBody } = req.body;

    /*Si nos falta algún parámetro obligatorio lanzamos un error */
    if (!name || !surname || !email || !password) {
      const error = new Error('Falta algún parámetro que es obligatorio');
      error.httpStatus = 400;
      throw error;
    }

    /* Aquí buscamos en la base de datos si existe algún registro con el campo
    especificado como único */
    const [useroloquesea] = await connection.query(
      'SELECT id FROM user WHERE campounico = ?',
      [campoUnico]
    );

    /*Si hay un registro en la base de datos que concuerde con el campo especificado
    lanzamos un error diciendo que ya existe ese registro en la base de datos */
    if (useroloquesea.length > 0) {
      const error = new Error('Ya existe un registro con ese campo único');
      error.httpStatus = 409;
      throw error;
    }

    /* Aquí las funciones que necesitamos para manipular datos, encriptar contraseña,
    generar cadena aleatoria etc... */
    const generarTextoAleatorioParaNombrarFotos = getRandomString(40); // <-- Ejemplo

    /* Hacemos la operación con la base de datos de lo que necesitemos */
    await connection.query(
      `
        INSERT INTO user (name, surname, email, password, registryCode) values  (?, ?, ?, ?,?);
        `,
      [name, surname, email, encryptedPassword, registryCode]
    );

    /* Más funciones que podamos necesitar después de procesar en la base de datos */
    await checkEmail(email, registryCode);

    /* Enviamos respuesta en caso de que no saltara ningún error anterior, esto es 
    obligatorio para obtener respuesta del servidor */
    res.send({
      status: 'ok',
      message: 'Resistro completado, comprueba tu email para activar tu cuenta',
    });

    /* En caso de error con el try, el catch debe llevar el next(error) obligatoriamente */
  } catch (error) {
    next(error);
    /* Y siempre se cierra la conexión creada para liberarla */
  } finally {
    if (connection) connection.release();
  }
};

/* Exportamos el módulo creado para poder utilizarlo en server.js */
module.exports = controllerTemplate;
