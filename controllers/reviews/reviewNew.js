'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');

const reviewNew = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { ticketNumber } = req.params;
        const { description, score } = req.body;
        const { id: idReqUser } = req.userAuth;

        const [idBE] = await connection.query(
            `SELECT booking.id FROM booking WHERE booking.ticket = ?`,
            [ticketNumber]
        );

        const [user] = await connection.query(
            'SELECT idUser FROM booking_experience WHERE id = ?',
            [idBE[0].id]
        );

        if (user[0].idUser !== idReqUser) {
            const error = new Error('No tienes derecho para votar!!');
            error.httpStatus = 401;
            throw error;
        }

        const [reviewCheck] = await connection.query(
            'SELECT idBookingExperience, voted FROM review WHERE idBookingExperience = ?',
            [idBE[0].id]
        );

        if (
            reviewCheck.length > 0 &&
            reviewCheck[0].voted !== 0 &&
            reviewCheck[0].idBookingExperience === Number(idBE[0].id)
        ) {
            const error = new Error('Ya has votado!!');
            error.httpStatus = 401;
            throw error;
        }

        await connection.query(
            'INSERT INTO review SET idBookingExperience = ?, description = ?, score = ?, voted = 1',
            [idBE[0].id, description, score]
        );

        res.send({
            status: 'ok',
            message: 'Votación correcta',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = reviewNew;
