'use strict';

const getDB = require('../../database/getDB');

const bookingGet = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking: ticketBooking } = req.params;
        const { id: idReqUser } = req.userAuth;

        let booking = [];

        if (ticketBooking) {
            const [bookingCheck] = await connection.query(
                `SELECT idUser FROM booking WHERE ticket = ?`,
                [ticketBooking]
            );

            if (bookingCheck.length < 1) {
                const error = new Error('No existe la reserva');
                error.httpStatus = 404;
                throw error;
            }

            // [booking] = await connection.query(
            //     `SELECT experience.title, user.name, booking.ticket, booking_experience.dateExperience, booking_experience.quantity, booking_experience.totalPrice FROM booking
            //     LEFT JOIN booking_experience ON booking.id = booking_experience.idBooking
            //     LEFT JOIN experience ON booking.idExperience = experience.id
            //     LEFT JOIN user ON booking.idUser = user.id
            //     WHERE booking.ticket = ?`,
            //     [ticketBooking]
            // );

            [booking] = await connection.query(
                `SELECT b.id, b.idExperience, b.idUser, b.ticket, b.expired, b.createdAt, be.dateExperience, e.title, e.description, e.location, e.photo from booking AS b
                LEFT JOIN booking_experience as be ON b.id = be.idBooking
                LEFT JOIN experience as e ON e.id = b.idExperience WHERE b.ticket = ?`,
                [ticketBooking]
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
                `SELECT b.id, b.idExperience, b.idUser, b.ticket, b.expired, b.createdAt, be.dateExperience, e.title, e.description, e.location, e.photo from booking AS b
                LEFT JOIN booking_experience as be ON b.id = be.idBooking
                LEFT JOIN experience as e ON e.id = b.idExperience
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
