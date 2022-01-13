'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');

const userGetProfile = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        const [user] = await connection.query(
            `SELECT id, name, surname, email, avatar, role, createdAt, modifiedAt FROM user WHERE id = ?`,
            [idReqUser]
        );

        const userProfile = {};

        if (user[0].id === idReqUser || req.userAuth.role === 'admin') {
            userProfile.name = user[0].name;
            userProfile.surname = user[0].surname;
            userProfile.email = user[0].email;
            userProfile.avatar = user[0].avatar;
            userProfile.role = user[0].role;
            userProfile.createdAt = user[0].createdAt;
            userProfile.modifiedAt = user[0].modifiedAt;
        }

        res.send({
            status: 'ok',
            data: userProfile,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userGetProfile;
