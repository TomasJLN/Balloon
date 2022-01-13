'use strict';

const getDB = require('../../database/getDB');

const bookingGet = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking } = req.params;
        const { id: idReqUser } = req.userAuth;

        let booking = [];

        if (idBooking) {
            const [bookingCheck] = await connection.query(
                `SELECT idUser FROM booking WHERE id = ?`,
                [idBooking]
            );

            if (bookingCheck.length < 1) {
                const error = new Error('No existe la reserva');
                error.httpStatus = 404;
                throw error;
            }

            [booking] = await connection.query(
                `SELECT experience.title, user.name, booking.ticket, booking_experience.dateExperience, booking_experience.quantity, booking_experience.totalPrice FROM booking 
                LEFT JOIN booking_experience ON booking.id = booking_experience.idBooking
                LEFT JOIN experience ON booking.idExperience = experience.id
                LEFT JOIN user ON booking.idUser = user.id
                WHERE booking.id = ?`,
                [idBooking]
            );

            if (Number(idReqUser) !== Number(bookingCheck[0].idUser)) {
                const error = new Error(
                    'La reserva no pertenece al usuario logueado'
                );
                error.httpStatus = 401;
                throw error;
            }
        } else {
            [booking] = await connection.query(
                `SELECT experience.title, user.name, booking.ticket, booking_experience.dateExperience, booking_experience.quantity, booking_experience.totalPrice FROM booking 
                LEFT JOIN booking_experience ON booking.id = booking_experience.idBooking
                LEFT JOIN experience ON booking.idExperience = experience.id
                LEFT JOIN user ON booking.idUser = user.id
                WHERE booking.idUser = ?`,
                [Number(idReqUser)]
            );
        }

        res.send({
            status: 'ok',
            data: booking,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingGet;
