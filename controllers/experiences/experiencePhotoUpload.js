'use strict';

const getDB = require('../../database/getDB');
const { savePhoto, deletePhoto } = require('../../helpers');

const experiencePhotoUpload = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExperience } = req.params;
        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error(
                'No tienes permisos para editar la experiencia'
            );
            error.httpStatus = 401;
            throw error;
        }

        if (!(req.files && req.files.photo)) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [experience] = await connection.query(
            'SELECT photo FROM experience WHERE id = ?',
            [idExperience]
        );

        if (experience.length < 1) {
            const error = new Error('No existe la experiencia');
            error.httpStatus = 404;
            throw error;
        }

        if (experience[0].photo) {
            await deletePhoto(experience[0].photo);
        }

        const photoName = await savePhoto(req.files.photo, 1);

        await connection.query(
            `UPDATE experience SET photo = ?, modifiedAt = now() WHERE id = ?`,
            [photoName, idExperience]
        );

        res.send({
            status: 'ok',
            message: 'Foto de experiencia actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experiencePhotoUpload;
