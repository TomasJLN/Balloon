const getDB = require('../database/getDB');

const bookingsByCategory = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const [list] = await connection.query(`
            SELECT
                category.title AS category,
                COUNT(*)       AS bookings
            FROM booking_experience
            LEFT JOIN experience ON booking_experience.idExperience = experience.id
            LEFT JOIN category   ON experience.idCategory = category.id
            WHERE category.title IS NOT NULL
            GROUP BY category.id, category.title
            ORDER BY bookings DESC
        `);

        res.send({ status: 'ok', data: list });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingsByCategory;
