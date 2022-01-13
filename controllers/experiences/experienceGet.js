'use strict';

const getDB = require('../../database/getDB');

const experienceGet = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /*Aquí destructuring de los parámetros necesarios que trae el body */
        const { idExperience } = req.params;

        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para crear');
            error.httpStatus = 401;
            throw error;
        }

        const [experience] = await connection.query(
            `SELECT idCategory, title, description, price, location, coords, photo, startDate, endDate, active, featured, totalPlaces, conditions, normatives FROM experience WHERE id = ?`,
            [idExperience]
        );

        if (experience.length < 1) {
            const error = new Error('No existe la experiencia');
            error.httpStatus = 404;
            throw error;
        }

        res.send({
            status: 'ok',
            data: experience[0],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experienceGet;
