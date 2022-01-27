'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { getRandomString, sendMail } = require('../../helpers');
const recoveryPassword = require('../../templates/recoveryPassword');

const userRecoveryPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        if (!email) {
            const error = new Error('Falta email del usuario');
            error.httpStatus = 404;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT id, name FROM user WHERE email = ?',
            [email]
        );

        if (user.length > 0) {
            const recoveryCode = getRandomString(20);

            const emailText = recoveryPassword(recoveryCode, user[0].name);

            await sendMail({
                to: email,
                subject: 'Recupera tu contraseña en Balloon 🎈',
                body: emailText,
            });

            await connection.query(
                `
            UPDATE user SET recoveryCode = ?, modifiedAt = now() WHERE email = ?`,
                [recoveryCode, email]
            );
        }

        res.send({
            status: 'ok',
            data: 'Se te ha enviado un código de recuperación, comprueba tu email para activar tu cuenta',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userRecoveryPassword;
