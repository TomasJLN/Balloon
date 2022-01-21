'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const { categoryNewSchema } = require('../../validations/categoryNewSchema');

const categoryNew = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { title, description } = req.body;

        await validate(categoryNewSchema, req.body);

        const { id: idReqUser, role: roleReqUser } = req.userAuth;

        console.log(idReqUser, roleReqUser);

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para crear');
            error.httpStatus = 401;
            throw error;
        }

        if (!title) {
            const error = new Error('Falta el título obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [category] = await connection.query(
            'SELECT id FROM category WHERE title = ?',
            [title]
        );

        if (category.length > 0) {
            const error = new Error('Ya existe la categoría');
            error.httpStatus = 409;
            throw error;
        }

        await connection.query(
            `
        INSERT INTO category (title, description) values  (?, ?);
        `,
            [title, description]
        );

        res.send({
            status: 'ok',
            message: 'Categoría creada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryNew;
