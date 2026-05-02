'use strict';

const getDB = require('../../database/getDB');

const bookingList = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error(
                'No tienes privilegios para listar las reservas'
            );
            error.httpStatus = 401;
            throw error;
        }

        const { order, direction } = req.query;

        const validOrderOptions = [
            'experience',
            'date_experience',
            'total_price',
            'user',
        ];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        const orderBy = validOrderOptions.includes(order)
            ? order
            : 'date_experience';

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
        const offset = (page - 1) * limit;

        const [[{ total }]] = await connection.query(
            `SELECT COUNT(*) AS total FROM booking`
        );

        const query = `SELECT booking.id, user.name AS user, experience.title AS experience, booking.ticket AS ticket, booking_experience.dateExperience AS date_experience, booking_experience.quantity AS quantity, booking_experience.totalPrice AS total_price FROM booking 
        LEFT JOIN booking_experience ON booking.id = booking_experience.id
        LEFT JOIN user ON booking.idUser = user.id
        LEFT JOIN experience ON booking.idExperience = experience.id ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`;

        const [list] = await connection.query(query, [limit, offset]);

        res.send({
            status: 'ok',
            data: list,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingList;
