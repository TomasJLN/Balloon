/** Requirements **/
const getDB = require('../database/getDB');

const userCheckMail = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        const [user] = await connection.query(
            `SELECT email FROM user WHERE email = ? AND deleted = false`,
            [email]
        );

        if (user.length < 1) {
            const error = new Error('El usuario no existe en la base de datos');
            error.httpStatus = 404;
            throw error;
        }
        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userCheckMail;
