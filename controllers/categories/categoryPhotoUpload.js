'use strict';

const getDB = require('../../database/getDB');
const { savePhoto, deletePhoto } = require('../../helpers');

const categoryPhotoUpload = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idCategory } = req.params;
        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error(
                'No tienes permisos para editar la categoría'
            );
            error.httpStatus = 401;
            throw error;
        }

        if (!(req.files && req.files.photo)) {
            const error = new Error('Falta algún parámetro que es obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [category] = await connection.query(
            'SELECT photo FROM category WHERE id = ?',
            [idCategory]
        );

        console.log(category[0].photo);

        if (category.length < 1) {
            const error = new Error('No existe la categoría');
            error.httpStatus = 404;
            throw error;
        }

        if (category[0].photo) {
            await deletePhoto(category[0].photo);
        }

        const photoName = await savePhoto(req.files.photo, 1);

        await connection.query(`UPDATE category SET photo = ? WHERE id = ?`, [
            photoName,
            idCategory,
        ]);

        res.send({
            status: 'ok',
            data: 'Foto de categoria actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = categoryPhotoUpload;
