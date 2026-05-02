'use strict';

const getDB = require('../../database/getDB');

const adminGetUsers = async (req, res, next) => {
    let connection;

    try {
        const { role } = req.userAuth;

        if (role !== 'admin' && role !== 'viewer') {
            const error = new Error('Acceso restringido a administradores');
            error.httpStatus = 403;
            throw error;
        }

        connection = await getDB();

        // viewer no recibe emails (privacidad)
        const fields = role === 'admin'
            ? 'id, name, surname, email, role, active, avatar, createdAt'
            : 'id, name, surname, role, active, avatar, createdAt';

        const [users] = await connection.query(`
            SELECT ${fields}
            FROM user
            WHERE deleted = 0
            ORDER BY createdAt DESC
        `);

        res.send({ status: 'ok', data: users });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = adminGetUsers;
