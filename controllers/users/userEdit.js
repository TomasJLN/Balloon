'use strict';

/** Requirements **/
const bcrypt = require('bcrypt');
const saltRounds = 10;
const getDB = require('../../database/getDB');

const userEdit = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        console.log(typeof idReqUser);

        let { name, surname, password, newPassword } = req.body;

        const [user] = await connection.query(
            'SELECT id, name, surname, password FROM user WHERE id = ?',
            [idReqUser]
        );
        name = name || user[0].name;
        surname = surname || user[0].surname;

        if ((!password && newPassword) || (password && !newPassword)) {
            const error = new Error('Faltan password o newPassword');
            error.httpStatus = 401;
            throw error;
        }

        if (password && newPassword) {
            const checkPassword = await bcrypt.compare(
                password,
                user[0].password
            );
            let newEncryptedPassword;
            if (checkPassword) {
                newEncryptedPassword = await bcrypt.hash(
                    newPassword,
                    saltRounds
                );
            } else {
                const error = new Error('Contraseña incorrecta');
                error.httpStatus = 401;
                throw error;
            }
            await connection.query(
                `
            UPDATE user SET name= ?, surname = ?, password = ? WHERE id = ?;
            `,
                [name, surname, newEncryptedPassword, idReqUser]
            );
        } else {
            await connection.query(
                `
            UPDATE user SET name = ?, surname = ? WHERE id = ?;
            `,
                [name, surname, idReqUser]
            );
        }

        res.send({
            status: 'ok',
            message: 'Resistro actualizado!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userEdit;
