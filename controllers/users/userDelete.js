'use strinct';

/** Requirements **/
const getDB = require('../../database/getDB');

const { deletePhoto } = require('../../helpers');

const userDelete = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const idReqUser = req.userAuth.id;

        if (idReqUser === 1 || req.userAuth.role === 'admin') {
            const error = new Error(
                'No se puede eliminar la cuenta de Administrador'
            );
            error.httpStatus = 403;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT avatar FROM user WHERE id = ?`,
            [idReqUser]
        );

        if (user[0].avatar) await deletePhoto(user[0].avatar);

        await connection.query(
            `UPDATE user SET email = ?, active = false, deleted = true, modifiedAt = now() WHERE id = ?`,
            [idReqUser, idReqUser]
        );

        res.send({
            status: 'ok',
            message: 'Usuario eliminado de la base de datos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userDelete;
