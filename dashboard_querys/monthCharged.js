const moment = require('moment');
const getDB = require('../database/getDB');

const monthCharged = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const date = new Date();
        const firstDay = moment(
            new Date(date.getFullYear(), date.getMonth(), 1)
        ).format('YYYY-MM-DD');
        const lastDay = moment(
            new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format('YYYY-MM-DD');

        const query = `SELECT sum(totalPrice) AS totalCharged FROM booking_experience where dateExperience between "${firstDay}" and "${lastDay}"`;

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

module.exports = monthCharged;
