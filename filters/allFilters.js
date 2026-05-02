const getDB = require('../database/getDB');

const allFilters = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const [ratingColumns] = await connection.query(
            `SHOW COLUMNS FROM experience LIKE 'rating'`
        );
        const ratingColumn =
            ratingColumns.length > 0 ? 'experience.rating' : 'experience.ratin';

        let {
            start,
            end,
            start_price,
            end_price,
            location,
            experience,
            category,
            rating,
            ratin,
            order,
            direction,
            active,
            featured,
        } = req.query;

        const validOrderOptions = {
            category: 'category',
            id: 'experience.id',
            price: 'experience.price',
            location: 'experience.location',
            title: 'experience.title',
        };
        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions[order] || 'experience.price';

        const directionValue = direction ? direction.toUpperCase() : undefined;
        const orderDirection = validDirectionOptions.includes(directionValue)
            ? directionValue
            : 'ASC';

        start_price = !start_price && end_price ? 1 : start_price;
        end_price = end_price ? end_price : 10000;
        rating = rating || ratin;

        let query = `SELECT category.title AS category, experience.id AS id, experience.idCategory, experience.title, experience.price, experience.startDate,
         experience.endDate, experience.location, experience.coords, experience.description, experience.photo, ${ratingColumn} AS rating, ${ratingColumn} AS ratin, experience.featured, experience.active, experience.totalPlaces
         FROM experience
         INNER JOIN category ON experience.idCategory = category.id
         WHERE category.active = 1`;

        const values = [];

        if (active) {
            query += ` AND experience.active = 1`;
        }

        if (start && end) {
            query += ` AND ((? BETWEEN experience.startDate AND experience.endDate) 
                    OR (? BETWEEN experience.startDate AND experience.endDate) AND now() < experience.endDate)`;
            values.push(end, start);
        } else if (start) {
            query += ` AND (? BETWEEN now() AND experience.endDate)`;
            values.push(start);
        } else if (end) {
            query += ` AND (? BETWEEN now() AND experience.endDate)`;
            values.push(end);
        } else {
            query += ` AND (now() < experience.endDate)`;
        }

        if (start_price && end_price) {
            query += ` AND experience.price BETWEEN ? AND ?`;
            values.push(Number(start_price), Number(end_price));
        }

        if (location) {
            query += ` AND experience.location LIKE ?`;
            values.push(`%${location}%`);
        }

        if (rating) {
            query += ` AND ${ratingColumn} >= ?`;
            values.push(Number(rating));
        }

        if (experience) {
            query += ` AND (experience.title LIKE ? OR experience.description LIKE ?)`;
            values.push(`%${experience}%`, `%${experience}%`);
        }

        if (category) {
            query += ` AND (category.title LIKE ? OR category.description LIKE ?)`;
            values.push(`%${category}%`, `%${category}%`);
        }

        if (featured === '1') query += ` AND experience.featured = '1'`;

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

module.exports = allFilters;
