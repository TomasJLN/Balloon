const getDB = require('../../database/getDB');

const reviewGet = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { ticket } = req.query;

        let [data] = await connection.query(
            `SELECT review.idBookingExperience, review.description, review.score, review.voted, 
            review.createdAt, booking.idExperience
            FROM review 
            inner join booking
            on review.idBookingExperience = booking.id 
            where booking.ticket = ? 
            ORDER BY voted DESC;`,
            [ticket]
        );

        if (data.length < 1) {
            const error = new Error(
                'No existe ninguna opinión sobre esa experiencia'
            );
            error.httpStatus = 404;
            throw error;
        }

        res.send({
            status: 'ok',
            data: data[0],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = reviewGet;
