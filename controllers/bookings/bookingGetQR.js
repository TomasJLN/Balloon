'use strict';

const getDB = require('../../database/getDB');

const bookingGetQR = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking: ticketBooking } = req.params;
        const { id: idReqUser } = req.userAuth;

        let bookingQRs = [];

        const [bookingCheck] = await connection.query(
            `SELECT idUser, id FROM booking WHERE ticket = ?`,
            [ticketBooking]
        );

        if (bookingCheck.length < 1) {
            const error = new Error('No existe la reserva');
            error.httpStatus = 404;
            throw error;
        }

        [bookingQRs] = await connection.query(
            `SELECT qr.qrPicture from qr WHERE qr.idBooking = ?`,
            [bookingCheck[0].id]
        );

        if (Number(idReqUser) !== Number(bookingCheck[0].idUser)) {
            const error = new Error(
                'La reserva no pertenece al usuario logueado'
            );
            error.httpStatus = 401;
            throw error;
        }

        res.send({
            status: 'ok',
            data: bookingQRs,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingGetQR;
