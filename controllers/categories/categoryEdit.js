'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');

const categoryEdit = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idCategory } = req.params;
        const { role: roleReqUser } = req.userAuth;

        let { title, description, active } = req.body;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para editar');
            error.httpStatus = 401;
            throw error;
        }

        const [category] = await connection.query(
            'SELECT id, title, description, active FROM category WHERE id = ?',
            [idCategory]
        );

        if (category.length < 1) {
            const error = new Error('No existe la categoría');
            error.httpStatus = 404;
            throw error;
        }

        title = title || category[0].title;
        description = description || category[0].description;
        active = active || category[0].active;

        await connection.query(
            `
            UPDATE category SET title= ?, description = ?, active = ? WHERE id = ?;
            `,
            [title, description, active, idCategory]
        );

        res.send({
            status: 'ok',
            message: 'Categoría actualizada!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryEdit;
