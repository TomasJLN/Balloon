'use strict';

/** Requirements **/
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDB = require('../../database/getDB');

const userLogin = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT id, password, active, role FROM user WHERE email = ?',
            [email]
        );

        let checkPassword = false;

        if (user.length > 0) {
            checkPassword = await bcrypt.compare(password, user[0].password);
        }

        if (user.length < 1 || !checkPassword) {
            const error = new Error('email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        if (!user[0].active) {
            const error = new Error(
                'La cuenta de usuario no está activa, revisa tu email'
            );
            error.httpStatus = 401;
            throw error;
        }

        const infoToken = {
            id: user[0].id,
            role: user[0].role,
        };
        const token = jwt.sign(infoToken, process.env.SECRET, {
            expiresIn: '10d',
        });

        res.send({
            status: 'ok',
            data: token,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userLogin;
