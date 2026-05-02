const getDB = require('../../database/getDB');

const experienceList = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
        const offset = (page - 1) * limit;

        const [[{ total }]] = await connection.query(
            `SELECT COUNT(*) AS total FROM experience WHERE active = 1 AND endDate >= NOW()`
        );

        const [list] = await connection.query(
            `SELECT * FROM experience WHERE active = 1 AND endDate >= NOW() ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        res.send({
            status: 'ok',
            data: list,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experienceList;
