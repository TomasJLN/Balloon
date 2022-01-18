const getDB = require('../../database/getDB');

const experienceList = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const query = `SELECT * FROM experience WHERE active = 1 
        && endDate >= now()
        ORDER BY title ASC`;

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

module.exports = experienceList;
