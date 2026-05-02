'use strict';

/** Requirements **/
const getDB = require('../../database/getDB');
const { getRandomString, sendMail } = require('../../helpers');
const QRCode = require('qrcode');
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

        // Iniciar transacción para garantizar consistencia
        await connection.beginTransaction();

        try {
            const [bookingResult] = await connection.query(
                `INSERT INTO booking (idExperience, idUser, ticket) VALUES (?, ?, ?)`,
                [idExperience, idReqUser, ticket]
            );

            const bookingId = bookingResult.insertId;

            const [[{ price: unitPrice }]] = await connection.query(
                `SELECT price FROM experience WHERE id = ?`,
                [idExperience]
            );

            await connection.query(
                `INSERT INTO booking_experience (dateExperience, quantity, totalPrice, idBooking, idExperience, idUser) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    dateExperience,
                    quantity,
                    Number(unitPrice) * quantity,
                    bookingId,
                    idExperience,
                    idReqUser,
                ]
            );

            const [[{ email: toEmail }]] = await connection.query(
                `SELECT email FROM user WHERE id = ?`,
                [idReqUser]
            );

            const arrQR = [];
            for (let i = 0; i < codesQR.length; i++) {
                const code = codesQR[i];
                const stringData = JSON.stringify(code);

                const qrSvg = await QRCode.toString(stringData, {
                    type: 'svg',
                    width: 200,
                    color: { dark: '#555555', light: '#FFF' },
                });
                arrQR.push(qrSvg);

                await QRCode.toFile(
                    `./static/uploads/${code}.png`,
                    stringData,
                    { color: { dark: '#555555', light: '#FFF' } }
                );

                await connection.query(
                    `INSERT INTO qr (idBooking, qrPicture) VALUES (?, ?)`,
                    [bookingId, `${code}.png`]
                );
            }

            await connection.commit();

            const to = toEmail;

        let coords =
            experience[0].coords !== null
                ? experience[0].coords
                : '40.417006315800684,-3.7026041791471616';
        coords = coords.replace(/ +/g, '');

        let bodyText = `
        <body style="margin: 0; box-sizing: border-box; padding: 0">
        <section
            style="
            background-color: rgb(63, 176, 172);
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
            data: ticket,
        });
        } catch (txError) {
            await connection.rollback();
            throw txError;
        }
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = bookingNew;
