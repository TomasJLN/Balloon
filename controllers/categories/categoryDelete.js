'use strinct';

/** Requirements **/
const getDB = require('../../database/getDB');
const { deletePhoto } = require('../../helpers');

const categoryDelete = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { idCategory } = req.params;
        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para borrar');
            error.httpStatus = 401;
            throw error;
        }

        const [category] = await connection.query(
            `SELECT id, photo, active FROM category WHERE id = ?`,
            [idCategory]
        );

        if (category.length < 1) {
            const error = new Error('La categoría no existe');
            error.httpStatus = 404;
            throw error;
        }

        if (category[0].active !== 1) {
            const error = new Error('La categoría está desactiva');
            error.httpStatus = 401;
            throw error;
        }

        if (category[0].photo) await deletePhoto(category[0].photo);

        await connection.query(`DELETE FROM category WHERE id = ?`, [
            idCategory,
        ]);

        res.send({
            status: 'ok',
            data: 'Categoría eliminada de la base de datos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryDelete;
