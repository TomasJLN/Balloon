'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { validate } = require('../../helpers');
const { newsletterSchema } = require('../../validations/newsletterSchema');

const newsletterNew = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        console.log(email);

        await validate(newsletterSchema, req.body);

        if (!email) {
            const error = new Error('Falta email obligatorio');
            error.httpStatus = 400;
            throw error;
        }

        const [mail] = await connection.query(
            'SELECT email FROM newsletter WHERE email = ?',
            [email]
        );

        console.log(mail);

        if (mail.length > 0) {
            const error = new Error('Email ya registrado en la Newsletter');
            error.httpStatus = 409;
            throw error;
        }

        await connection.query(
            `
        INSERT INTO newsletter (email) values  (?);
        `,
            [email]
        );

        res.send({
            status: 'ok',
            data: 'Email añadido a la Newsletter',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newsletterNew;
