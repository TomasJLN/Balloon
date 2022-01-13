/** Requirements **/
const getDB = require('../database/getDB');

const userExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        const [user] = await connection.query(
            `SELECT id FROM user WHERE id = ? AND deleted = false`,
            [Number(idReqUser)]
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

module.exports = userExists;
