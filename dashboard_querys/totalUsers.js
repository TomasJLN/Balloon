const getDB = require('../database/getDB');

const totalUsers = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const query = `SELECT count(*) as nUsers FROM balloon_db.user`;

        const [list] = await connection.query(`${query}`);

        res.send({
            status: 'ok',
            data: list[0],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = totalUsers;
