'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

// ─── Datos de experiencias ───────────────────────────────────────────────────

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
    d.setDate(Math.min(day, 28));
    d.setHours(rand(9, 20), 0, 0, 0);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ─── Setup principal ─────────────────────────────────────────────────────────

async function setup() {
    let connection;

    try {
        // Conectar sin base de datos para poder crearla
        const pool = mysql.createPool({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            timezone: 'Z',
        });
        connection = await pool.getConnection();

        // 1. Crear base de datos
        console.log(`\n[1/5] Creando base de datos ${MYSQL_DATABASE}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
        await connection.query(`USE \`${MYSQL_DATABASE}\``);
        console.log('      ✓ Listo');

        // 2. Crear tablas
        console.log('\n[2/5] Creando tablas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(150) NOT NULL,
                surname VARCHAR(150) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(50),
                active BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM('admin', 'user', 'viewer') DEFAULT 'user' NOT NULL,
                recoveryCode VARCHAR(150),
                registryCode VARCHAR(150),
                createdAt DATETIME DEFAULT now(),
                modifiedAt DATETIME
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS category (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(50) UNIQUE NOT NULL,
                description VARCHAR(255),
                photo VARCHAR(50),
                active BOOLEAN DEFAULT true,
                createdAt DATETIME DEFAULT now()
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS experience (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idCategory INT UNSIGNED NOT NULL,
                FOREIGN KEY (idCategory) REFERENCES category(id) ON UPDATE CASCADE ON DELETE CASCADE,
                title VARCHAR(150) NOT NULL,
                description VARCHAR(255),
                price DECIMAL(6,2) NOT NULL,
                location VARCHAR(100) NOT NULL,
                coords VARCHAR(100),
                photo VARCHAR(50),
                startDate DATETIME,
                endDate DATETIME,
                active BOOLEAN DEFAULT true,
                featured BOOLEAN DEFAULT false,
                rating TINYINT UNSIGNED DEFAULT 0,
                totalPlaces TINYINT UNSIGNED NOT NULL DEFAULT 10,
                conditions VARCHAR(255),
                normatives VARCHAR(255),
                createdAt DATETIME NOT NULL DEFAULT now(),
                modifiedAt DATETIME
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS booking (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idExperience INT UNSIGNED NOT NULL,
                FOREIGN KEY (idExperience) REFERENCES experience(id) ON UPDATE CASCADE ON DELETE CASCADE,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE,
                ticket VARCHAR(20) NOT NULL UNIQUE,
                expired BOOLEAN DEFAULT false,
                createdAt DATETIME NOT NULL DEFAULT now()
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS booking_experience (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                dateExperience DATETIME NOT NULL,
                quantity TINYINT UNSIGNED NOT NULL DEFAULT 1,
                totalPrice DECIMAL(6,2) NOT NULL,
                idBooking INT UNSIGNED NOT NULL,
                FOREIGN KEY (idBooking) REFERENCES booking(id) ON UPDATE CASCADE ON DELETE CASCADE,
                idExperience INT UNSIGNED NOT NULL,
                idUser INT UNSIGNED NOT NULL
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS qr (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idBooking INT UNSIGNED NOT NULL,
                FOREIGN KEY (idBooking) REFERENCES booking(id) ON UPDATE CASCADE ON DELETE CASCADE,
                qrPicture VARCHAR(50) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT now()
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS review (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idBookingExperience INT UNSIGNED NOT NULL,
                FOREIGN KEY (idBookingExperience) REFERENCES booking_experience(idBooking) ON UPDATE CASCADE ON DELETE CASCADE,
                description VARCHAR(255),
                score TINYINT UNSIGNED NOT NULL DEFAULT 60,
                voted BOOLEAN NOT NULL DEFAULT false,
                createdAt DATETIME NOT NULL DEFAULT now()
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS newsletter (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) NOT NULL UNIQUE,
                active BOOLEAN DEFAULT true,
                removed BOOLEAN DEFAULT false
            )
        `);

        // Migración segura del ENUM
        await connection.query(`
            ALTER TABLE user
            MODIFY COLUMN role ENUM('admin', 'user', 'viewer') DEFAULT 'user' NOT NULL
        `);

        console.log('      ✓ Listo');

        // 3. Admin
        console.log('\n[3/5] Creando usuario administrador...');
        const adminPwd = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await connection.query(
            `INSERT IGNORE INTO user (name, surname, email, password, active, role)
             VALUES ('Admin', 'Admin', ?, ?, true, 'admin')`,
            [ADMIN_EMAIL, adminPwd]
        );
        console.log(`      ✓ ${ADMIN_EMAIL}`);

        // 4. Categorías y experiencias
        console.log('\n[4/5] Insertando categorías y experiencias...');

        await connection.query(`
            INSERT IGNORE INTO category (title, description, photo) VALUES
            ('Aventura', 'Atrévete a saltar en paracaídas o sin él, buceo con tiburones, un salto de puenting, rafting, nodejs y más.', '5bd148d3-e7f5-4350-b328-bdbcc00cdaa5.jpg'),
            ('Gourmet', 'Experimenta nuevos sabores, prueba las nuevas cervezas artesanales fermentadas en el retrete, catas de vinos con taxi para la vuelta incluído.', '1dc0d9a9-b596-4d55-976d-e060ed43b49b.jpg'),
            ('Relax', 'Las mejores experiencias en Spa, baños turcos, baños árabes, bañeras y mucho más.', '2745c6b4-79e7-4639-956d-9331ecbb6ea8.jpg'),
            ('Naturaleza', 'Camina con osos pardos, recoge setas venenosas, chupa piel de sapo y más.', '7b8fea88-f038-42a7-b78c-29a6109dcdc7.jpg')
        `);

        const [categories] = await connection.query(`
            SELECT id, title
            FROM category
            WHERE title IN ('Aventura', 'Gourmet', 'Relax', 'Naturaleza')
        `);
        const categoryIds = Object.fromEntries(categories.map((category) => [category.title, category.id]));

        const [[{ catCount }]] = await connection.query('SELECT COUNT(*) AS catCount FROM experience');

        if (catCount === 0) {
            await connection.query(`
                INSERT INTO experience (idCategory, title, description, price, location, coords, photo, startDate, endDate, active, featured, totalPlaces, conditions, normatives) VALUES
                (${categoryIds.Aventura}, 'Vuelo en Parapente con video', 'Blablabla', 55, 'Tarragona', '41.24192461416068,0.948559', 'parapente.png', '2026-01-01', '2026-12-31', 1, 0, 10, 'Peso máximo: 110 kg', 'Es necesario llevar ropa de abrigo, protección solar y agua'),
                (${categoryIds.Aventura}, 'Vuelo en helicóptero', 'Ahora tienes la oportunidad de ver la ciudad de Barcelona de una manera completamente nueva', 77.9, 'Barcelona', '41.36031140114586,2.1802289100901384', 'helicoptero.jpg', '2026-01-01', '2026-12-31', 1, 0, 10, 'Peso máximo: 130 kilos En caso de superar los 110 kg, el participante deberá pagar 2 plazas', 'N/A'),
                (${categoryIds.Aventura}, 'Vuelo en túnel de Viento', 'Prepárate para vivir una de las experiencias más emocionantes que te puedas imaginar. ¡Vuela en un túnel del viento en Barcelona!', 89, 'Barcelona', '41.34898735362118,2.0751412037014574', 'tunel3.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'No se puede volar bajo los efectos del alcohol o estupefacientes.', 'N/A'),
                (${categoryIds.Aventura}, 'Vuelo en globo', 'Disfruta de un paseo por las nubes con este paseo en globo por Segovia.', 170, 'Segovia', '40.944759253468284,-4.127564942627999', '64388097-a29d-4806-b6ba-d5788a2f2304.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Se recomienda llevar ropa y calzado cómodo', 'N/A'),
                (${categoryIds.Gourmet}, 'Cena con las estrellas en el Observatori Fabra', '¿Tenéis ganas de hacer algo diferente? Preparaos para disfrutar de una velada inolvidable.', 75, 'Barcelona', '41.418539705715204,2.1241767460298204', 'fabra.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'El Observatorio Fabra tiene una temperatura de hasta 6º menos que la del centro de Barcelona.', 'N/A'),
                (${categoryIds.Gourmet}, 'Cata de cervezas y degustación de quesos', 'Breve historia de la cerveza, orígenes, la edad media, la cerveza en la actualidad.', 25, 'Madrid', '40.431531446157884,-3.671625685672846', 'quesos.jpg', '2026-01-01', '2026-12-31', 1, 0, 10, 'Edad minima: 18 años', 'N/A'),
                (${categoryIds.Gourmet}, 'Curso de arroces con degustación', 'Durante el taller se cocinarán 3 arroces: un arroz caldoso de mar y montaña, un arroz negro con sepia y alioli y un risotto de boletus.', 50, 'Madrid', '40.389296368720174,-3.7427093558209084', 'arroces.png', '2026-01-01', '2026-12-31', 1, 1, 10, 'N/A', 'N/A'),
                (${categoryIds.Relax}, 'Circuito Onsen Spa y Masaje en Esenzias', 'Adentraos en un spa japonés en pleno centro de Madrid: Esenzias Spa.', 108, 'Madrid', '40.414813911017525,-3.702844', 'f5e49a98-a560-4a50-a5b1-7d036884d5fa.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Es necesario llevar bañador y goma para llevar el pelo recogido.', 'N/A'),
                (${categoryIds.Relax}, 'Circuito termal y masaje en Hotel Termes La Garriga 4º', '¡Piensa en ti y en tu bienestar con esta experiencia!', 55, 'Barcelona', '41.681571199289436,2.27904580865751', '43274220-dc40-4665-9381-ae8c8ca732b5.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Es necesario llevar traje de baño, toalla y chanclas.', 'N/A'),
                (${categoryIds.Naturaleza}, 'Circuito Multiaventura. Almuerzo, Parasailing y Moto de Agua', '¿Tienes ganas de disfrutar de un completo día de actividades acuáticas?', 200, 'Salou', '41.06928274247286,1.1791299074064623', '4c238d42-aeaa-4ac0-a9c8-a559d5620879.jpg', '2026-01-01', '2026-12-31', 1, 0, 10, 'Es necesario saber nadar.', 'Edad mínima: 12 años.'),
                (${categoryIds.Naturaleza}, 'Visita al Zoo de Cañada Verde', 'Conoced Cañada Verde y disfrutad de una Visita al Zoo de Animales Autóctonos.', 30, 'Hornachuelos, Córdoba', '37.82326388434454,-5.256443507940359', 'a341ed7d-e9f4-4aa9-b0e0-6120bae805e1.jpg', '2026-01-01', '2026-12-31', 1, 0, 10, 'Edad mínima: 3 años', 'N/A'),
                (${categoryIds.Aventura}, 'Excursión en kayak en el Parque Natural de los Acantilados de Cerro Gordo-Maro', 'Vea los acantilados de Maro-Cerro Gordo desde un kayak y disfrute de vistas.', 30, 'Almuñécar', '36.74638439528105,-3.7815815710931373', 'kayak1.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'No es recomendable para viajeros con problemas de espalda.', 'N/A'),
                (${categoryIds.Naturaleza}, 'Senderismo en Montserrat y Visita al Monasterio', 'Esta excursión le ofrece transporte de ida y vuelta desde Barcelona.', 65, 'Barcelona', '41.60915105491232,1.818414647959166', 'senderismo1.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Los viajeros deben tener una condición física media.', 'N/A'),
                (${categoryIds.Naturaleza}, 'Excursión en barco de avistamiento de ballenas y delfines', 'Descubra la belleza del océano Atlántico en esta excursión en barco desde Los Cristianos.', 25, 'Arona', '28.048213504335717,-16.716593063522875', 'delfines1.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Esta experiencia es apta solo para adultos.', 'Se recomienda llevar bañador y crema solar.'),
                (${categoryIds.Aventura}, 'Lanzamiento de Hacha 1h', 'Te enseñaremos el arte del lanzamiento de hacha y las normas de seguridad.', 19.2, 'Madrid', '40.40634722788905,-3.678616500553418', 'lanzamientoHacha.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Edad mínima: 18 años', 'Es necesario llevar calzado cerrado.'),
                (${categoryIds.Aventura}, 'Barranquismo (León)', 'Descubre esta increíble actividad en el barranco de Cacabillos.', 49, 'Villamanín - León', '42.92928413361034,-5.807957671879364', 'f9d12826-46ee-4250-91dc-2ed6ed323c5e.jpg', '2026-01-01', '2026-12-31', 1, 10, 10, 'Es necesario llevar traje de baño y botas de montaña.', 'N/A'),
                (${categoryIds.Relax}, 'Circuito Spa y Cena para dos en Royal Hideaway Sancti Petri Spa', 'Descubrid uno de los spas más impresionantes de Andalucía.', 125, 'Chiclana de la Frontera', '36.4051466269535,-6.145741061503644', 'cd187416-4263-4f89-b434-38d67d876f48.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Es necesario llevar traje de baño, gorro, chanclas y toalla.', 'N/A'),
                (${categoryIds.Relax}, 'Circuito Spa para dos en Centro Spaxión', 'Encontraréis el spa en pleno centro y a 5 minutos a pie del casco histórico.', 54, 'Pontevedra', '42.43130236535369,-8.639184542328364', 'c2b68959-d438-4802-88fc-316d10bc348c.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Obligatorio adquirir el gorro y las chanclas en el centro por 3€', 'N/A'),
                (${categoryIds.Aventura}, 'Trío de Coches: Ferrari, Lamborghini y Porsche + Vuelta en Coche de Alta', '¡Conduce tres coches! Ponte a los mandos de un Ferrari, un Lamborghini y un Porsche.', 129, 'Zaragoza', '41.080462588344844,-0.20430562846484984', '3aa38e26-63d5-4a8e-9165-c854cc437379.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'N/A', 'N/A'),
                (${categoryIds.Gourmet}, 'Visita a Bodegas Martín Códax con Cata de 2 Vinos', 'Conoceréis de primera mano el mundo del vino y su cultura.', 17.9, 'Pontevedra', '42.520273876136194,-8.792415459572137', 'cataVinos1.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'Los menores de edad podrán visitar la bodega acompañados de un tutor.', 'N/A'),
                (${categoryIds.Aventura}, 'Vuelo en Globo con Desayuno, Cava y Vídeo', 'Disfruta de un paseo por el cielo de Arcos de la Frontera.', 160, 'Arcos de la Frontera', '36.75431372445721,-5.808155831697719', 'globo.jpg', '2026-01-01', '2026-12-31', 1, 1, 10, 'La experiencia no la pueden realizar personas que no gocen de buena salud.', 'N/A'),
                (${categoryIds.Aventura}, 'Alas para dos: Túnel de Viento para dos en Windobona', 'Probad una experiencia completamente nueva y liberad toda la adrenalina.', 89, 'Madrid', '40.36413200993128,-3.739990220895459', 'tunelViento.png', '2026-01-01', '2026-12-31', 1, 1, 10, 'Es necesario llevar zapatillas de deporte limpias y bien sujetas.', 'N/A')
            `);
        } else {
            console.log('      → Experiencias ya existentes, omitiendo inserción');
        }
        console.log('      ✓ Listo');

        // 5. Datos demo
        console.log('\n[5/5] Insertando datos demo...');

        // Limpiar demo previo
        const [demoUsers] = await connection.query(`SELECT id FROM user WHERE email LIKE '%@demo.com'`);
        if (demoUsers.length > 0) {
            const userIds = demoUsers.map(u => u.id);
            const [demoBookings] = await connection.query(`SELECT id FROM booking WHERE idUser IN (?)`, [userIds]);
            if (demoBookings.length > 0) {
                const bookingIds = demoBookings.map(b => b.id);
                const [demoBeRows] = await connection.query(`SELECT id FROM booking_experience WHERE idBooking IN (?)`, [bookingIds]);
                if (demoBeRows.length > 0) {
                    const beIds = demoBeRows.map(be => be.id);
                    await connection.query(`DELETE FROM review WHERE idBookingExperience IN (?)`, [beIds]);
                    await connection.query(`DELETE FROM booking_experience WHERE id IN (?)`, [beIds]);
                }
                await connection.query(`DELETE FROM booking WHERE id IN (?)`, [bookingIds]);
            }
            await connection.query(`DELETE FROM user WHERE id IN (?)`, [userIds]);
        }

        // Usuarios demo
        const hashedPwd = await bcrypt.hash('Demo1234!', 10);
        const userIds = [];
        for (const u of DEMO_USERS) {
            const [r] = await connection.query(
                `INSERT INTO user (name, surname, email, password, active, role, createdAt) VALUES (?, ?, ?, ?, 1, 'user', NOW())`,
                [u.name, u.surname, u.email, hashedPwd]
            );
            userIds.push(r.insertId);
        }

        // Viewer
        const viewerPwd = await bcrypt.hash('123456', 10);
        await connection.query(
            `INSERT INTO user (name, surname, email, password, active, role, createdAt) VALUES ('Demo', 'Viewer', 'viewer@demo.com', ?, 1, 'viewer', NOW())`,
            [viewerPwd]
        );
        console.log(`      ✓ ${userIds.length} usuarios demo + 1 viewer`);

        // Reservas
        const [experiences] = await connection.query(`SELECT id, price FROM experience WHERE active = 1`);
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
                    `INSERT INTO booking (idExperience, idUser, ticket, expired, createdAt) VALUES (?, ?, ?, 0, NOW())`,
                    [exp.id, userId, ticket]
                );
                const [beRes] = await connection.query(
                    `INSERT INTO booking_experience (dateExperience, quantity, totalPrice, idBooking, idExperience, idUser) VALUES (?, ?, ?, ?, ?, ?)`,
                    [date, qty, total, bookingRes.insertId, exp.id, userId]
                );
                if (!bookingExpByExpId[exp.id]) bookingExpByExpId[exp.id] = [];
                bookingExpByExpId[exp.id].push(beRes.insertId);
            }
        }

        // Reseñas
        const topExps = Object.entries(bookingExpByExpId).sort((a, b) => b[1].length - a[1].length).slice(0, 8);
        let reviewCount = 0;
        for (const [, beIds] of topExps) {
            const numReviews = Math.min(rand(2, 5), beIds.length);
            for (let i = 0; i < numReviews; i++) {
                await connection.query(
                    `INSERT INTO review (idBookingExperience, description, score, voted, createdAt) VALUES (?, ?, ?, 1, NOW())`,
                    [beIds[i], pick(REVIEW_TEXTS), rand(65, 100)]
                );
                reviewCount++;
            }
        }
        console.log(`      ✓ ${Object.values(bookingExpByExpId).flat().length} reservas y ${reviewCount} reseñas`);

        console.log('\n✅ Setup completado.\n');
        console.log('   Admin:  ' + ADMIN_EMAIL + ' / ' + ADMIN_PASSWORD);
        console.log('   Viewer: viewer@demo.com / 123456');
        console.log('   Users:  cualquier @demo.com / Demo1234!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

setup();
