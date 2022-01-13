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

        const query = `select booking.id, user.name AS user, experience.title AS experience, booking.ticket AS ticket, booking_experience.dateExperience AS date_experience, booking_experience.quantity AS quantity, booking_experience.totalPrice AS total_price from booking 
        left join booking_experience on booking.id = booking_experience.id
        left join user on booking.idUser = user.id
        left join experience on booking.idExperience = experience.id ORDER BY ${orderBy} ${orderDirection}`;

        const [list] = await connection.query(`${query}`);

        res.send({
            status: 'ok',
            data: {
                list,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingList;
