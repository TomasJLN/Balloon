'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const {
    experienceNewSchema,
} = require('../../validations/experienceNewSchema');

const experienceNew = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const {
            idCategory,
            title,
            description,
            price,
            location,
            coords,
            startDate,
            endDate,
            featured,
            totalPlaces,
            conditions,
            normatives,
        } = req.body;

        await validate(experienceNewSchema, req.body);

        const { role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'admin') {
            const error = new Error('No tienes privilegios para crear');
            error.httpStatus = 401;
            throw error;
        }

        if (!idCategory || !title || !price || !location || !totalPlaces) {
            const error = new Error('Faltan campos obligatorios');
            error.httpStatus = 400;
            throw error;
        }

        const [category] = await connection.query(
            'SELECT id FROM category WHERE id = ?',
            [idCategory]
        );

        if (category.length < 1) {
            const error = new Error('No existe esa categoría');
            error.httpStatus = 409;
            throw error;
        }

        await connection.query(
            `
        INSERT INTO experience (idCategory, title, description, price, location, coords, startDate, endDate, featured, totalPlaces, conditions, normatives) values  (?, ?,?,?,?,?,?,?,?,?,?,?);
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
                featured,
                totalPlaces,
                conditions,
                normatives,
            ]
        );

        res.send({
            status: 'ok',
            data: 'Experiencia creada satisfactoriamente',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = experienceNew;
