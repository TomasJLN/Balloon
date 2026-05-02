const getDB = require('../database/getDB');

const categoriesFilter = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        let { title, order, direction, includeInactive } = req.query;

        const validOrderOptions = ['id', 'title'];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'title';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        const values = [];

        let query = `SELECT id, title, description, photo, active
        FROM category
        WHERE 1 = 1`;

        if (includeInactive !== '1') {
            query += ` AND active = 1`;
        }

        if (title) {
            query += ` AND (id LIKE ? OR title LIKE ?)`;
            values.push(title, `%${title}%`);
        }

        query += ` ORDER BY ${orderBy} ${orderDirection}`;

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

module.exports = categoriesFilter;
