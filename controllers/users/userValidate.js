'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const userValidate = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registryCode } = req.params;

        const [user] = await connection.query(
            `
    SELECT id FROM user WHERE registryCode = ?`,
            [registryCode]
        );

        if (user.length < 1) {
            const error = new Error('Código de registro no válido');
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(
            `Update user SET active=true, registryCode = NULL, modifiedAt = now() WHERE registryCode = ?`,
            [registryCode]
        );

        res.send({
            status: 'ok',
            message: 'El usuario ha sido activado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userValidate;
