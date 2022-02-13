const getDB = require('../database/getDB');

const allFilters = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        let {
            start,
            end,
            start_price,
            end_price,
            location,
            experience,
            category,
            order,
            direction,
            featured,
        } = req.query;

        const validOrderOptions = [
            'category',
            'experience',
            'price',
            'location',
            'title',
        ];
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'price';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        start_price = !start_price && end_price ? 1 : start_price;
        end_price = end_price ? end_price : 10000;

        let query = `SELECT category.title AS category, experience.id AS id, experience.title, experience.price, experience.startDate,
         experience.endDate, experience.location, experience.coords, experience.description, experience.photo, experience.featured, experience.active 
         FROM experience, category
         WHERE experience.active = 1 AND experience.idCategory = category.id`;

        if (start && end) {
            query += ` AND (('${end}' BETWEEN experience.startDate AND experience.endDate) 
                    OR ('${start}' BETWEEN experience.startDate AND experience.endDate) AND now() < experience.endDate)`;
        } else if (start) {
            query += ` AND ('${start}' BETWEEN now() AND experience.endDate)`;
        } else if (end) {
            query += ` AND ('${end}' BETWEEN now() AND experience.endDate)`;
        } else {
            query += ` AND (now() < experience.endDate)`;
        }

        if (start_price && end_price)
            query += ` AND experience.price BETWEEN ${start_price} AND ${end_price}`;

        if (location) query += ` AND experience.location like '%${location}%'`;

        if (experience)
            query += ` AND (experience.title like '%${experience}%' OR experience.description like '%${experience}%')`;

        if (category)
            query += ` AND (category.title like '%${category}%' OR category.description like '%${category}%')`;

        if (featured === '1') query += ` AND experience.featured = '1'`;

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

module.exports = allFilters;
