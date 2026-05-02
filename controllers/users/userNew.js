'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const { userNewSchema } = require('../../validations/userNewSchema');

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

        const maxUserAccounts = Number(process.env.MAX_USER_ACCOUNTS || 50);

        if (Number.isInteger(maxUserAccounts) && maxUserAccounts > 0) {
            const [[{ totalUsers }]] = await connection.query(
                `SELECT COUNT(*) AS totalUsers
                FROM user
                WHERE role = 'user' AND deleted = 0`
            );

            if (Number(totalUsers) >= maxUserAccounts) {
                const error = new Error(
                    'Se ha alcanzado el número máximo de usuarios registrados'
                );
                error.httpStatus = 403;
                throw error;
            }
        }

        const [existing] = await connection.query(
            'SELECT id FROM user WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            const error = new Error('Ya existe la cuenta para este email');
            error.httpStatus = 409;
            throw error;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.query(
            `INSERT INTO user (name, surname, email, password, active) VALUES (?, ?, ?, ?, 1)`,
            [name, surname, email, encryptedPassword]
        );

        const token = jwt.sign(
            { id: result.insertId, role: 'user' },
            process.env.SECRET,
            { expiresIn: '10d' }
        );

        res.status(201).send({
            status: 'ok',
            data: token,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userNew;
