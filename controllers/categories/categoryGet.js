'use strict';

const getDB = require('../../database/getDB');

const categoryGet = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        /*Aquí destructuring de los parámetros necesarios que trae el body */
        const { idCategory } = req.params;

        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para crear');
            error.httpStatus = 401;
            throw error;
        }

        const [category] = await connection.query(
            `SELECT id, title, description, photo, active, createdAt FROM category WHERE id = ?`,
            [idCategory]
        );

        if (category.length < 1) {
            const error = new Error('No existe la categoría');
            error.httpStatus = 404;
            throw error;
        }

        res.send({
            status: 'ok',
            data: category[0],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryGet;
