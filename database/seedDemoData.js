'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const getDB = require('./getDB');

const DEMO_USERS = [
    { name: 'María',   surname: 'López',      email: 'maria.lopez@demo.com' },
    { name: 'Carlos',  surname: 'García',     email: 'carlos.garcia@demo.com' },
    { name: 'Laura',   surname: 'Martínez',   email: 'laura.martinez@demo.com' },
    { name: 'Pablo',   surname: 'Sánchez',    email: 'pablo.sanchez@demo.com' },
    { name: 'Ana',     surname: 'Fernández',  email: 'ana.fernandez@demo.com' },
    { name: 'Javier',  surname: 'Rodríguez',  email: 'javier.rodriguez@demo.com' },
    { name: 'Sara',    surname: 'Gómez',      email: 'sara.gomez@demo.com' },
    { name: 'Miguel',  surname: 'Díaz',       email: 'miguel.diaz@demo.com' },
    { name: 'Elena',   surname: 'Torres',     email: 'elena.torres@demo.com' },
    { name: 'David',   surname: 'Ruiz',       email: 'david.ruiz@demo.com' },
];

// Reservas por mes (índice 0 = mes actual, índice 6 = hace 6 meses)
const MONTHLY_BOOKINGS = [6, 10, 14, 11, 8, 5, 3];

const REVIEW_TEXTS = [
    '¡Experiencia increíble! Lo repetiría sin dudarlo.',
    'Muy bien organizado, el personal fue excelente.',
    'Superó todas mis expectativas, totalmente recomendable.',
    'Una jornada perfecta, volvería a repetir sin duda.',
    'Todo salió a la perfección, muy profesionales.',
    'Increíble, los guías fueron fantásticos y muy atentos.',
    'Muy buena relación calidad-precio, lo recomiendo.',
    'Perfecta para celebrar ocasiones especiales con familia.',
    'El mejor plan que he hecho en mucho tiempo.',
    'Ambiente genial y muy bien organizado, repetiremos.',
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick  = (arr)      => arr[rand(0, arr.length - 1)];

function dateInMonth(monthsAgo, day) {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(Math.min(day, 28)); // evita desbordamiento de mes
    d.setHours(rand(9, 20), 0, 0, 0);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function seedDemoData() {
    let connection;
    try {
        connection = await getDB();
        console.log('Limpiando datos demo anteriores...');

        // 1. Recoger IDs de usuarios demo
        const [demoUsers] = await connection.query(
            `SELECT id FROM user WHERE email LIKE '%@demo.com'`
        );

        if (demoUsers.length > 0) {
            const userIds = demoUsers.map(u => u.id);

            // 2. Recoger IDs de bookings de esos usuarios
            const [demoBookings] = await connection.query(
                `SELECT id FROM booking WHERE idUser IN (?)`, [userIds]
            );

            if (demoBookings.length > 0) {
                const bookingIds = demoBookings.map(b => b.id);

                // 3. Recoger IDs de booking_experience de esos bookings
                const [demoBeRows] = await connection.query(
                    `SELECT id FROM booking_experience WHERE idBooking IN (?)`, [bookingIds]
                );

                if (demoBeRows.length > 0) {
                    const beIds = demoBeRows.map(be => be.id);
                    // 4. Borrar reviews → booking_experience → bookings (en orden FK)
                    await connection.query(
                        `DELETE FROM review WHERE idBookingExperience IN (?)`, [beIds]
                    );
                    await connection.query(
                        `DELETE FROM booking_experience WHERE id IN (?)`, [beIds]
                    );
                }

                await connection.query(
                    `DELETE FROM booking WHERE id IN (?)`, [bookingIds]
                );
            }

            // 5. Borrar usuarios demo
            await connection.query(
                `DELETE FROM user WHERE id IN (?)`, [userIds]
            );
            console.log(`  → ${demoUsers.length} usuarios demo anteriores eliminados`);
        } else {
            console.log('  → Sin datos demo previos');
        }

        // Asegura que el ENUM de 'role' incluye 'viewer' (por si no se ejecutó npm run db)
        await connection.query(`
            ALTER TABLE user
            MODIFY COLUMN role ENUM('admin', 'user', 'viewer') DEFAULT 'user' NOT NULL
        `);

        // --- Usuarios ---
        const hashedPwd = await bcrypt.hash('Demo1234!', 10);
        const userIds = [];
        for (const u of DEMO_USERS) {
            const [r] = await connection.query(
                `INSERT INTO user (name, surname, email, password, active, role, createdAt)
                 VALUES (?, ?, ?, ?, 1, 'user', NOW())`,
                [u.name, u.surname, u.email, hashedPwd]
            );
            userIds.push(r.insertId);
        }

        // Cuenta viewer (acceso de solo lectura al dashboard)
        const viewerPwd = await bcrypt.hash('123456', 10);
        await connection.query(
            `INSERT INTO user (name, surname, email, password, active, role, createdAt)
             VALUES ('Demo', 'Viewer', 'viewer@demo.com', ?, 1, 'viewer', NOW())`,
            [viewerPwd]
        );

        console.log(`✓ ${userIds.length} usuarios demo + 1 cuenta viewer creados`);

        // --- Experiencias existentes ---
        const [experiences] = await connection.query(
            `SELECT id, price FROM experience WHERE active = 1`
        );
        if (!experiences.length) {
            console.error('No hay experiencias. Ejecuta primero: npm run populate');
            return;
        }

        // --- Reservas distribuidas en los últimos 6 meses ---
        const bookingExpByExpId = {};
        let ticketNum = 2000;

        for (let monthsAgo = 6; monthsAgo >= 0; monthsAgo--) {
            const count = MONTHLY_BOOKINGS[monthsAgo];
            for (let i = 0; i < count; i++) {
                const exp    = pick(experiences);
                const userId = pick(userIds);
                const qty    = rand(1, 3);
                const total  = parseFloat((exp.price * qty).toFixed(2));
                const date   = dateInMonth(monthsAgo, rand(1, 26));
                const ticket = `DEMO-${++ticketNum}`;

                const [bookingRes] = await connection.query(
                    `INSERT INTO booking (idExperience, idUser, ticket, expired, createdAt)
                     VALUES (?, ?, ?, 0, NOW())`,
                    [exp.id, userId, ticket]
                );

                const [beRes] = await connection.query(
                    `INSERT INTO booking_experience
                        (dateExperience, quantity, totalPrice, idBooking, idExperience, idUser)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [date, qty, total, bookingRes.insertId, exp.id, userId]
                );

                if (!bookingExpByExpId[exp.id]) bookingExpByExpId[exp.id] = [];
                bookingExpByExpId[exp.id].push(beRes.insertId);
            }
        }

        const totalBookings = Object.values(bookingExpByExpId).flat().length;
        console.log(`✓ ${totalBookings} reservas demo creadas`);

        // --- Reseñas para las experiencias más reservadas ---
        const topExps = Object.entries(bookingExpByExpId)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 8);

        let reviewCount = 0;
        for (const [, beIds] of topExps) {
            const numReviews = Math.min(rand(2, 5), beIds.length);
            for (let i = 0; i < numReviews; i++) {
                await connection.query(
                    `INSERT INTO review (idBookingExperience, description, score, voted, createdAt)
                     VALUES (?, ?, ?, 1, NOW())`,
                    [beIds[i], pick(REVIEW_TEXTS), rand(65, 100)]
                );
                reviewCount++;
            }
        }
        console.log(`✓ ${reviewCount} reseñas demo creadas`);

        console.log('\n✅ ¡Demo data lista!');
        console.log('   Usuarios: cualquier email @demo.com  |  Contraseña: Demo1234!');
    } catch (err) {
        console.error('Error al generar demo data:', err.message);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

seedDemoData();
