'use strict';

/** Requirements **/
const { now } = require('lodash');
const getDB = require('../database/getDB');

const canVote = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { ticketNumber } = req.params;
        const [idBE] = await connection.query(
            `SELECT booking.id FROM booking WHERE booking.ticket = ?`,
            [ticketNumber]
        );

        const [expDate] = await connection.query(
            'SELECT dateExperience FROM booking_experience WHERE id = ?',
            [idBE[0].id]
        );

        if (expDate[0].dateExperience > now()) {
            const error = new Error(
                'No puedes votar hasta disfrutar la experiencia!!'
            );
            error.httpStatus = 403;
            throw error;
        }
        console.log('aqui llega - canVote');
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = canVote;
