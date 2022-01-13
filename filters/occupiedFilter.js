const getDB = require('../database/getDB');

const occupiedFilter = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { order, direction } = req.query;

        const validOrderOptions = [
            'category',
            'title',
            'Free Places',
            'price',
            'location',
        ];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        const orderBy = validOrderOptions.includes(order) ? order : 'title';

        const queryOrder = ` ORDER BY ${orderBy} ${orderDirection} `;

        let query = `SELECT category.title AS Category, experience.title, booking_experience.dateExperience AS DATE, (experience.totalPlaces - ifnull(SUM(booking_experience.quantity),0)) 
            AS 'Free Places', experience.totalPlaces, experience.price, experience.startDate, experience.endDate, experience.location, experience.description
            FROM booking_experience, experience 
            LEFT JOIN category ON experience.idCategory = category.id
            WHERE experience.id = booking_experience.idExperience AND experience.active = 1
            GROUP BY booking_experience.dateExperience, experience.title, experience.totalPlaces, experience.price, experience.startDate, experience.endDate, experience.location, 
            experience.description, category.id ${queryOrder}`;

        const [list] = await connection.query(`${query}`);

        res.send({
            status: 'ok',
            data: {
                list,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = occupiedFilter;
