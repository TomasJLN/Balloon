const getDB = require('../database/getDB');

const categoriesFilter = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        let { title, order, direction } = req.query;

        console.log(title);

        const validOrderOptions = ['id', 'title'];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'title';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        let query = `SELECT id, title, description, photo, active
        FROM category`;

        if (title) {
            query += ` WHERE id like '${title}' OR title like '%${title}%'`;
        }

        query += ` ORDER BY ${orderBy} ${orderDirection}`;

        console.log(query);

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

module.exports = categoriesFilter;
