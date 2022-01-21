'use strinct';

/** Requirements **/
const getDB = require('../../database/getDB');

const { deletePhoto } = require('../../helpers');

const experienceDelete = async (req, res, next) => {
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

        const [experience] = await connection.query(
            'SELECT id, photo FROM experience WHERE id = ? AND active = 1',
            [idExperience]
        );

        if (experience.length < 1) {
            const error = new Error('No existe la experiencia a borrar');
            error.httpStatus = 404;
            throw error;
        }

        if (experience[0].photo) await deletePhoto(experience[0].photo);

        await connection.query(
            `UPDATE experience SET description=NULL, price=0, location='deleted', coords = NULL, photo = NULL, startDate = NULL, endDate = NULL, active = false, featured = false, totalPlaces= 0, conditions = NULL, normatives = NULL, modifiedAt = now() WHERE id = ?`,
            [idExperience]
        );

        res.send({
            status: 'ok',
            message: 'Experiencia eliminada de la base de datos',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experienceDelete;
