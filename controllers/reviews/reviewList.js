const getDB = require('../../database/getDB');

const reviewList = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { searchByExp, order, direction } = req.query;

        const validOrderOptions = [
            'experience',
            'score',
            'date',
            'user',
            'category',
        ];

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'date';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'ASC';

        let list;

        if (searchByExp) {
            [list] = await connection.query(
                `
                SELECT experience.id, experience.title AS experience, review.description, review.score AS score, 
                review.createdAt AS date, user.name AS user, category.title AS category FROM review 
                LEFT JOIN booking_experience ON review.idBookingExperience = booking_experience.id 
                LEFT JOIN experience ON booking_experience.idExperience = experience.id 
                LEFT JOIN user ON booking_experience.idUser = user.id 
                LEFT JOIN category ON experience.idCategory = category.id 
                WHERE booking_experience.idExperience = ? 
                ORDER BY ${orderBy} ${orderDirection};
                `,
                [searchByExp]
            );
        } else {
            [list] = await connection.query(
                `
                SELECT experience.id, experience.title AS experience, review.description, review.score AS score, 
                review.createdAt AS date, user.name AS user, category.title AS category FROM review 
                LEFT JOIN booking_experience ON review.idBookingExperience = booking_experience.id 
                LEFT JOIN experience ON booking_experience.idExperience = experience.id 
                LEFT JOIN user ON booking_experience.idUser = user.id 
                LEFT JOIN category ON experience.idCategory = category.id 
                ORDER BY ${orderBy} ${orderDirection};
                `
            );
        }

        if (list.length < 1) {
            const error = new Error(
                'No existe ninguna opinión sobre esa experiencia'
            );
            error.httpStatus = 404;
            // throw error;
        }

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

module.exports = reviewList;
