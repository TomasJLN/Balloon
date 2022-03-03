'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userResetPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { recoveryCode, newPassword } = req.body;

        if (!recoveryCode || !newPassword) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT id FROM user WHERE recoveryCode = ?',
            [recoveryCode]
        );

        if (user.length < 1) {
            const error = new Error('Código de recuperación no válido');
            error.httpStatus = 404;
            throw error;
        }

        const encryptedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await connection.query(
            `UPDATE user SET password = ?, recoveryCode = NULL, modifiedAt = now() WHERE id = ?;`,
            [encryptedNewPassword, user[0].id]
        );

        res.send({
            status: 'ok',
            data: 'Código de registro correcto. Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userResetPassword;
