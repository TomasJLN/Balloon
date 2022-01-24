'use strict';

/** Requirements **/
const bcrypt = require('bcrypt');
const saltRounds = 10;
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const { userNewSchema } = require('../../validations/userNewSchema');

const { getRandomString, checkEmail } = require('../../helpers');

const userNew = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { name, surname, email, password, passwordRepeat } = req.body;

        await validate(userNewSchema, req.body);

        if (!name || !surname || !email || !password || !passwordRepeat) {
            const error = new Error('Faltan campos obligatorios');
            error.httpStatus = 400;
            throw error;
        }

        if (password !== passwordRepeat) {
            const error = new Error(
                'Los campos de contraseña no concuerdan, la contraseña debe ser la misma'
            );
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT id FROM user WHERE email = ?',
            [email]
        );

        if (user.length > 0) {
            const error = new Error('Ya existe la cuenta para este email');
            error.httpStatus = 409;
            throw error;
        }

        const registryCode = getRandomString(40);
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        await connection.query(
            `
        INSERT INTO user (name, surname, email, password, registryCode) values  (?, ?, ?, ?,?);
        `,
            [name, surname, email, encryptedPassword, registryCode]
        );

        await checkEmail(email, registryCode);

        res.send({
            status: 'ok',
            message:
                'Resistro completado, comprueba tu email para activar tu cuenta',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userNew;
