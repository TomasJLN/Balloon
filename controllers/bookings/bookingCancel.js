'use strict';

const { now } = require('lodash');
/** Requirements **/
const getDB = require('../../database/getDB');
const { deletePhoto, sendMail } = require('../../helpers');

const bookingCancel = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { ticketNumber } = req.params;
        const { id: idReqUser } = req.userAuth;

        const [data] = await connection.query(
            `
            SELECT booking.id, booking.idUser AS idUser, booking.ticket AS ticket, qr.qrPicture, booking_experience.dateExperience AS dateExperience,
            booking_experience.quantity AS quantity, booking_experience.totalPrice AS totalPrice, booking_experience.idExperience,
            experience.location AS location, experience.title AS title
            from booking 
            INNER JOIN qr
            ON booking.id = qr.idBooking
            INNER JOIN booking_experience
            ON booking.id = booking_experience.idBooking
            INNER JOIN experience
            ON booking_experience.idExperience = experience.id
            WHERE booking.ticket = ?;`,
            [ticketNumber]
        );

        const idBE = Number(data[0].id);

        const dataBooking = {
            ticket: data[0].ticket,
            user: data[0].idUser,
            date: data[0].dateExperience,
            quantity: data[0].quantity,
            total: data[0].totalPrice,
            experience: data[0].title,
            location: data[0].location,
        };

        if (Number(idReqUser) !== Number(data[0].idUser)) {
            const error = new Error(
                'No tienes permitido cancelar esta reserva'
            );
            error.httpStatus = 401;
            throw error;
        }

        if (now() >= Number(data[0].dateExperience)) {
            const error = new Error(
                'No se puede cancelar una reserva con menos de 24h de antelación'
            );
            error.httpStatus = 401;
            throw error;
        }

        const [to] = await connection.query(
            `SELECT email FROM user WHERE id = ?`,
            [idReqUser]
        );

        const [qrs] = await connection.query(
            `SELECT id, qrPicture FROM qr WHERE idBooking = ?`,
            [idBE]
        );

        for (const qr of qrs) {
            if (qr.qrPicture) await deletePhoto(qr.qrPicture);
        }

        await connection.query(`DELETE FROM booking WHERE id = ?`, [idBE]);

        let bodyText = `
        <body style="margin: 0; box-sizing: border-box; padding: 0">
        <section
            style="
            background-color: rebeccapurple;
            border-radius: 1px solid red;
            color: whitesmoke;
            display: flex;
            flex-direction: column;
            padding: 0 16px;
            text-align: left;
            "
        >     
        <h2>Tu reserva ha sido cancelada 😥</h2>
        <div>
        <h3>Reserva nº: ${dataBooking.ticket}</h3>
        <p>Experiencia: ${dataBooking.experience}</p>
        <p>Fecha Experiencia: ${dataBooking.date}</p>
        <p>Localización: ${dataBooking.location}</p>`;
        bodyText += `</div>`;

        await sendMail({
            to,
            subject: `Cancelación Reserva Nº ${dataBooking.ticket} en Balloon 🎈`,
            body: bodyText,
        });

        res.send({
            status: 'ok',
            data: 'Reserva Cancelada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingCancel;
