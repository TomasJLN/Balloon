'use strict';

const getDB = require('../../database/getDB');

const categoryList = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const [category] = await connection.query(
            `SELECT id, title, description, photo, active, createdAt FROM category WHERE active = 1`
        );

        if (category.length < 1) {
            const error = new Error('No existe la categoría');
            error.httpStatus = 404;
            throw error;
        }

        res.send({
            status: 'ok',
            data: category,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryList;
