const getDB = require('../database/getDB');

const occupiedFilter = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        let { date, experienceID, order, direction } = req.query;

        const validOrderOptions = ['category', 'title', 'occupied', 'location'];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        const orderBy = validOrderOptions.includes(order) ? order : 'title';

        const queryOrder = ` ORDER BY ${orderBy} ${orderDirection} `;

        let query = `SELECT category.title AS category, experience.title, booking_experience.dateExperience, SUM(booking_experience.quantity) AS occupied, experience.totalPlaces, experience.location FROM experience right join booking_experience ON booking_experience.idExperience = experience.id left join category ON category.id = experience.idCategory WHERE experience.active=1`;

        const values = [];

        if (date) {
            // El front envía YYYY/MM/DD (DateObject.format); también aceptamos YYYY-MM-DD
            if (typeof date !== 'string' || !/^\d{4}[-/]\d{2}[-/]\d{2}/.test(date)) {
                const error = new Error('date debe tener formato YYYY-MM-DD');
                error.httpStatus = 400;
                throw error;
            }
            query += ` AND booking_experience.dateExperience = ?`;
            values.push(String(date));
        }

        if (experienceID) {
            if (!Number.isInteger(Number(experienceID))) {
                const error = new Error('experienceID debe ser un número');
                error.httpStatus = 400;
                throw error;
            }
            query += ` AND experience.id = ?`;
            values.push(Number(experienceID));
        }

        query += ` GROUP BY booking_experience.dateExperience, experience.title, experience.totalPlaces,experience.location, category.title`;

        query += ` ${queryOrder}`;

        const [list] = await connection.query(query, values);

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

module.exports = occupiedFilter;
