const getDB = require('../database/getDB');

const experienceFeatured = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { order, direction } = req.query;

        const validOrderOptions = ['title', 'price', 'location'];

        const orderBy = validOrderOptions.includes(order)
            ? 'experience.' + order
            : 'category.title';

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        const query = `SELECT category.title AS category, experience.id, experience.title As title, experience.description, 
        experience.price, experience.location, experience.photo, experience.coords, experience.startDate, experience.endDate
         FROM experience
         LEFT JOIN category ON experience.idCategory = category.id
        WHERE experience.active = 1 AND experience.featured = 1 AND now() < experience.endDate
        ORDER BY ${orderBy} ${orderDirection}`;

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

module.exports = experienceFeatured;
