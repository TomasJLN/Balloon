'use strict';

require('dotenv').config();

const path = require('path');
const { unlink, pathExists } = require('fs-extra');
const getDB = require('./getDB');

const confirmed = process.argv.includes('--confirm');

const removeUpload = async (fileName) => {
    if (!fileName) return;

    const safeName = path.basename(fileName);
    const uploadPath = path.join(
        __dirname,
        '..',
        process.env.UPLOADS_DIRECTORY,
        safeName,
    );

    if (await pathExists(uploadPath)) await unlink(uploadPath);
};

const purgePersonalDataForDemo = async () => {
    if (!confirmed) {
        throw new Error(
            'Operación cancelada. Añade --confirm para eliminar los datos no demostrativos.',
        );
    }

    let connection;

    try {
        connection = await getDB();

        const [users] = await connection.query(`
            SELECT id, avatar
            FROM user
            WHERE role = 'user' AND email NOT LIKE '%@demo.com'
        `);

        const userIds = users.map((user) => user.id);
        const filesToRemove = users.map((user) => user.avatar).filter(Boolean);

        await connection.beginTransaction();

        if (userIds.length > 0) {
            const [bookings] = await connection.query(
                'SELECT id FROM booking WHERE idUser IN (?)',
                [userIds],
            );
            const bookingIds = bookings.map((booking) => booking.id);

            if (bookingIds.length > 0) {
                const [bookingExperiences] = await connection.query(
                    'SELECT id FROM booking_experience WHERE idBooking IN (?)',
                    [bookingIds],
                );
                const bookingExperienceIds = bookingExperiences.map(
                    (bookingExperience) => bookingExperience.id,
                );

                const [qrFiles] = await connection.query(
                    'SELECT qrPicture FROM qr WHERE idBooking IN (?)',
                    [bookingIds],
                );
                filesToRemove.push(
                    ...qrFiles.map((qr) => qr.qrPicture).filter(Boolean),
                );

                if (bookingExperienceIds.length > 0) {
                    await connection.query(
                        'DELETE FROM review WHERE idBookingExperience IN (?)',
                        [bookingExperienceIds],
                    );
                    await connection.query(
                        'DELETE FROM booking_experience WHERE id IN (?)',
                        [bookingExperienceIds],
                    );
                }

                await connection.query(
                    'DELETE FROM qr WHERE idBooking IN (?)',
                    [bookingIds],
                );
                await connection.query(
                    'DELETE FROM booking WHERE id IN (?)',
                    [bookingIds],
                );
            }

            await connection.query('DELETE FROM user WHERE id IN (?)', [userIds]);
        }

        await connection.query('DELETE FROM newsletter');
        await connection.commit();

        await Promise.all(filesToRemove.map(removeUpload));

        console.log(
            `Modo demo saneado: ${userIds.length} cuenta(s) no demostrativa(s) eliminada(s).`,
        );
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

purgePersonalDataForDemo()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
