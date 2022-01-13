/** Requirements **/
const jwt = require('jsonwebtoken');
const getDB = require('../database/getDB');

const isAuth = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { authorization } = req.headers;

        if (!authorization) {
            const error = new Error('Falta la cabecera de autorización');
            error.httpStatus = 401;
            throw error;
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (_) {
            const error = new Error('Su Token no es válido');
            error.httpStatus = 401;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT active, deleted FROM user WHERE id = ?`,
            [tokenInfo.id]
        );

        if (user.length < 1) {
            const error = new Error('No existe ningún usuario con ese token');
            error.httpStatus = 404;
            throw error;
        }

        if (!user[0].active || user[0].deleted) {
            const error = new Error('Su Token no es válido');
            error.httpStatus = 401;
            throw error;
        }

        req.userAuth = tokenInfo;

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = isAuth;
