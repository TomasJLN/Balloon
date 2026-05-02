const getDB = require('../database/getDB');

const monthlyRevenue = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const [list] = await connection.query(`
            SELECT
                DATE_FORMAT(dateExperience, '%Y-%m') AS month,
                DATE_FORMAT(dateExperience, '%b')    AS monthName,
                COALESCE(SUM(totalPrice), 0)         AS revenue,
                COUNT(*)                             AS bookings
            FROM booking_experience
            WHERE dateExperience >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(dateExperience, '%Y-%m'), DATE_FORMAT(dateExperience, '%b')
            ORDER BY month ASC
        `);

        res.send({ status: 'ok', data: list });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = monthlyRevenue;
