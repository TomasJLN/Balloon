'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');

const experienceEdit = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExperience } = req.params;
        const { role: roleReqUser } = req.userAuth;

        let {
            idCategory,
            title,
            description,
            price,
            location,
            coords,
            startDate,
            endDate,
            active,
            featured,
            totalPlaces,
            conditions,
            normatives,
        } = req.body;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para editar');
            error.httpStatus = 401;
            throw error;
        }

        const [experience] = await connection.query(
            `SELECT idCategory, title, description, price, location, coords, startDate, endDate, active, featured, totalPlaces, conditions, normatives FROM experience WHERE id = ?`,
            [idExperience]
        );

        if (experience.length < 1) {
            const error = new Error('No existe la experiencia');
            error.httpStatus = 404;
            throw error;
        }

        const checkCategory = await connection.query(
            `SELECT id FROM category where id = ?`,
            [experience[0].idCategory]
        );

        if (checkCategory[0].length < 1) {
            const error = new Error('La categoría no existe');
            error.httpStatus = 404;
            throw error;
        }

        idCategory = idCategory || experience[0].idCategory;
        title = title || experience[0].title;
        description = description || experience[0].description;
        price = price || experience[0].price;
        location = location || experience[0].location;
        coords = coords || experience[0].coords;
        startDate = startDate || experience[0].startDate;
        endDate = endDate || experience[0].endDate;
        active = active || experience[0].active;
        featured = featured || experience[0].featured;
        totalPlaces = totalPlaces || experience[0].totalPlaces;
        conditions = conditions || experience[0].conditions;
        normatives = normatives || experience[0].normatives;

        await connection.query(
            `
            UPDATE experience SET idCategory = ?, title= ?, description = ?, price = ?, location = ?, coords = ?, startDate = ?, endDate = ?, active = ?, featured = ?, totalPlaces = ?, conditions = ?, normatives = ? WHERE id = ?;
            `,
            [
                idCategory,
                title,
                description,
                price,
                location,
                coords,
                startDate,
                endDate,
                active,
                featured,
                totalPlaces,
                conditions,
                normatives,
                idExperience,
            ]
        );

        res.send({
            status: 'ok',
            message: 'Experiencia actualizada!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experienceEdit;
