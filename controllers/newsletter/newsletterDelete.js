'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const { newsletterSchema } = require('../../validations/newsletterSchema');

const newsletterDelete = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        await validate(newsletterSchema, req.body);

        const [data] = await connection.query(
            `
            SELECT id, email, active, removed from newsletter WHERE email = ?;`,
            [email]
        );

        if (data[0].length < 1) {
            const error = new Error(
                'No existe el email registrado en la newsletter'
            );
            error.httpStatus = 404;
            throw error;
        }

        await connection.query(`DELETE FROM newsletter WHERE email = ?`, [
            data[0].email,
        ]);

        res.send({
            status: 'ok',
            data: 'Email eliminado de la Newsletter',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newsletterDelete;
