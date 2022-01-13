'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { savePhoto, deletePhoto } = require('../../helpers');

const userChangeAvatar = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        if (!(req.files && req.files.avatar)) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            'SELECT avatar FROM user WHERE id = ?',
            [idReqUser]
        );

        if (user[0].avatar) {
            await deletePhoto(user[0].avatar);
        }

        const avatarName = await savePhoto(req.files.avatar, 0);

        await connection.query(
            `UPDATE user SET avatar = ?, modifiedAt = now() WHERE id = ?`,
            [avatarName, idReqUser]
        );

        res.send({
            status: 'ok',
            message: 'Avatar del usuario actualizado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userChangeAvatar;
