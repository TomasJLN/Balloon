'use strict';

/** Requirements **/
const bcrypt = require('bcrypt');
const saltRounds = 10;
const getDB = require('../../database/getDB');

const userChangePassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT password FROM user WHERE id = ?',
            [idReqUser]
        );

        const checkPassword = await bcrypt.compare(
            oldPassword,
            user[0].password
        );

        if (!checkPassword) {
            const error = new Error('La contraseña es incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        const newEncryptedPassword = await bcrypt.hash(newPassword, saltRounds);

        await connection.query(
            `UPDATE user SET password = ?, modifiedAt = now() WHERE id = ?`,
            [newEncryptedPassword, idReqUser]
        );

        res.send({
            status: 'ok',
            message: 'Cambio de contraseña realizada satisfactoriamente.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userChangePassword;
