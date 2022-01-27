'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { getRandomString, sendMail } = require('../../helpers');
const QRCode = require('qrcode');
const { indexOf } = require('lodash');
const { validate } = require('../../helpers');
const { bookingNewSchema } = require('../../validations/bookingNewSchema');

const bookingNew = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        let { dateExperience, quantity, idExperience } = req.body;

        await validate(bookingNewSchema, req.body);

        quantity = Number(quantity);
        idExperience = Number(idExperience);

        const { id: idReqUser, role: roleReqUser } = req.userAuth;

        if (roleReqUser !== 'user') {
            const error = new Error(
                'No estás registrado para hacer una reserva'
            );
            error.httpStatus = 401;
            throw error;
        }

        const [experience] = await connection.query(
            `SELECT id, title, location, coords FROM experience WHERE id = ?`,
            [idExperience]
        );

        if (experience.length < 1) {
            const error = new Error('La experiencia no existe');
            error.httpStatus = 409;
            throw error;
        }

        if (new Date(dateExperience) < new Date()) {
            const error = new Error('No puedes reservar para una fecha pasada');
            error.httpStatus = 409;
            throw error;
        }

        const ticket = getRandomString(3);

        let codesQR = [];
        for (let i = 0; i < quantity; i++) {
            codesQR.push(getRandomString(3));
        }

        let getPlaces = await connection.query(
            `SELECT IFNULL(SUM(quantity),0) FROM booking_experience WHERE idExperience = ? AND dateExperience = ?`,
            [idExperience, dateExperience]
        );

        getPlaces = Number(Object.values(getPlaces[0][0]));

        let totPlaces = await connection.query(
            `SELECT totalPlaces FROM experience WHERE id = ?`,
            [idExperience]
        );

        totPlaces = Number(Object.values(totPlaces[0][0]));

        if (totPlaces < getPlaces + quantity) {
            const error = new Error(
                `No hay plazas suficientes: ${totPlaces - getPlaces - quantity}`
            );
            error.httpStatus = 401;
            throw error;
        }

        await connection.query(
            `
        INSERT INTO booking (idExperience, idUser, ticket) values  (?, ?, ?);
        `,
            [idExperience, idReqUser, ticket]
        );

        let nextId = await connection.query(
            `SELECT MAX(id) AS nextId FROM booking`
        );

        nextId = Number(Object.values(nextId[0][0]));

        let getPrice = await connection.query(
            `SELECT price FROM experience WHERE id = ?;`,
            [idExperience]
        );

        getPrice = Number(Object.values(getPrice[0][0]));

        await connection.query(
            `INSERT INTO booking_experience (dateExperience, quantity, totalPrice, idBooking, idExperience, idUser) values  (?, ?, ?, ?,?,?);`,
            [
                dateExperience,
                quantity,
                getPrice * quantity,
                nextId,
                idExperience,
                idReqUser,
            ]
        );

        let to = await connection.query(`SELECT email FROM user WHERE id = ?`, [
            idReqUser,
        ]);

        to = Object.values(to[0][0]);

        const arrQR = [];
        for (const code of codesQR) {
            let data = {
                title: indexOf(code) + 1,
                code,
            };

            let stringData = JSON.stringify(data.code);

            arrQR.push(
                QRCode.toString(
                    stringData,
                    {
                        type: 'svg',
                        width: 200,
                        color: { dark: '#343434', light: '#E639D8' },
                    },
                    (err, QRCode) => {
                        return QRCode;
                    }
                )
            );

            QRCode.toFile(
                `./static/uploads/${code}.png`,
                stringData,
                {
                    color: {
                        dark: '#00F',
                        light: '#bdb7ff',
                    },
                },
                function (err) {
                    if (err) throw err;
                    console.log('done');
                }
            );
            await connection.query(
                `
            INSERT INTO qr (idBooking, qrPicture) values  (?, ?);
            `,
                [nextId, `${code}.png`]
            );
        }

        const coords =
            experience[0].coords !== null
                ? experience[0].coords
                : '40.417006315800684, -3.7026041791471616';

        let bodyText = `
        <body style="margin: 0; box-sizing: border-box; padding: 0">
        <section
            style="
            background-color: rebeccapurple;
            border-radius: 1px solid red;
            color: whitesmoke;
            display: flex;
            flex-direction: column;
            padding: 0 16px;
            text-align: left;
            "
        >        
        <h2>Estos son los datos de tu reserva:</h2>
        <div>
        <h3>Reserva nº: ${ticket}</h3>
        <p>Experiencia: <strong>${experience[0].title}</strong></p>
        <p>Fecha Experiencia: <strong>${dateExperience}</strong></p>
        <p>Localización: <strong>${experience[0].location}</strong></p>
        <p><a href="https://www.google.es/maps/@${coords},19z" target="_blank" style="color:#ffffff; text-decoration:none" rel="Google Maps"> 🗺️ Google Maps</a></p>
        <p>Nº de plazas reservadas: <strong>${quantity}</strong> de <strong>${
            getPlaces + quantity
        }</strong> ocupadas de un total de <strong>${totPlaces}</strong> Plazas</p>
        <hr/>
        <p>Entrada/s:</p>`;
        for (const code of arrQR) {
            bodyText += `<p>Código:</p>
            <p>${code}</p>`;
        }
        bodyText += `</div>
        </section>
        </body>`;

        await sendMail({
            to,
            subject: `Reserva Nº ${ticket} en Balloon 🎈`,
            body: bodyText,
        });

        res.send({
            status: 'ok',
            data: 'Reserva creada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingNew;
