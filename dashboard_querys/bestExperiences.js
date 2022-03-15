const getDB = require('../database/getDB');

const bestExperiences = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const query = `SELECT booking_experience.idExperience, experience.title, count(*) as number FROM review
        left join booking_experience on idBookingExperience = booking_experience.id
        inner join experience on booking_experience.idExperience = experience.id
        group by booking_experience.idExperience ORDER BY number DESC
        limit 5;`;

        const [list] = await connection.query(`${query}`);

        res.send({
            status: 'ok',
            data: list,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bestExperiences;
