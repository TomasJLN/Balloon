/** Requirements **/
const getDB = require('../database/getDB');

const bookingExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { ticketNumber } = req.params;
        const [reviewCheck] = await connection.query(
            `SELECT booking_experience.id FROM booking_experience, booking WHERE booking.ticket = ?`,
            [ticketNumber]
        );

        if (reviewCheck.length < 1) {
            const error = new Error('La reserva no existe!');
            error.httpStatus = 404;
            throw error;
        }
        console.log('aqui llega - bookingExists');
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingExists;
