'use strict';

const getDB = require('../../database/getDB');

const adminToggleUser = async (req, res, next) => {
    let connection;

    try {
        if (req.userAuth.role !== 'admin') {
            const error = new Error('Acceso restringido a administradores');
            error.httpStatus = 403;
            throw error;
        }

        connection = await getDB();

        const { id } = req.params;

        const [rows] = await connection.query(
            `SELECT active FROM user WHERE id = ? AND deleted = 0`,
            [id]
        );

        if (!rows.length) {
            const error = new Error('Usuario no encontrado');
            error.httpStatus = 404;
            throw error;
        }

        const newActive = rows[0].active ? 0 : 1;

        await connection.query(
            `UPDATE user SET active = ? WHERE id = ?`,
            [newActive, id]
        );

        res.send({ status: 'ok', data: { active: newActive } });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = adminToggleUser;
