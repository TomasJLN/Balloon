'use strict';

/** Requirements **/
require('dotenv').config();
const getDB = require('./getDB');

async function populateData() {
    let connection;

    try {
        connection = await getDB();
        console.clear();
        console.log('Inserting some date into database...');

        //Create table category
        await connection.query(`
        INSERT INTO category (title, description) values 
        ('Aventura','Atrévete a saltar en paracaídas o sin él, buceo con tiburones, un salto de puenting, rafting, nodejs y más.'),
        ('Gourmet', 'Experimenta nuevos sabores, prueba las nuevas cervezas artesanales fermentadas en el retrete, catas de vinos con taxi para la vuelta incluído'),
        ('Relax', 'Las mejores experiencias en Spa, baños turcos, baños árabes, bañeras y mucho más'),
        ('Naturaleza', 'Camina con osos pardos, recoge setas venenosas, chupa piel de sapo y más.')
        `);

        //Create table experience
        await connection.query(`
        INSERT INTO experience (idCategory, title, description, price, location, coords, startDate, endDate, featured, conditions,normatives)
        VALUES
        (1,'Vuelo en Parapente con video', 'Blablabla', 55, 'Tarragona', '41.2123104650502, 0.9792378651733277', '2021-12-1', '2022-2-24', 0, 'N/A', 'N/A'),
        (1,'Vuelo en helicóptero', 'Blablabla', 77.90, 'Barcelona', '41.525247886651314, 1.97095384168887', '2021-12-15', '2022-3-31', 0, 'N/A', 'N/A'),
        (1,'Vuelo en túnel de Viento', 'Blablabla', 89, 'Barcelona', '41.34880631465778, 2.0749911983021305', '2021-1-1', '2022-5-31', 1, 'N/A', 'N/A'),
        (1,'Vuelo en globo', 'Blablabla', 170.00, 'Segovia', '40.94531758733573, -4.1316637968483905', '2021-12-12', '2022-5-20', 1, 'N/A', 'N/A'),
        (2,'Cena con las estrellas en el Observatori Fabra', 'Blablabla', 75, 'Barcelona', '41.418569935370584, 2.1241799983040273', '2021-1-1', '2022-12-31', 1, 'N/A', 'N/A'),
        (2,'Cata de cervezas y degustación de quesos', 'Blablabla', 25, 'Madrid', '40.41669509716843, -3.678061492369516', '2021-1-1', '2023-1-31', 0, 'N/A', 'N/A'),
        (2,'Curso de arroces con degustación', 'Blablabla', 50, 'Madrid', '40.41381711913654, -3.710419667858455', '2021-11-1', '2022-4-12', 0, 'N/A', 'N/A'),
        (3,'Circuito Onsen Spa y Masaje en Esenzias', 'Blablabla', 108, 'Madrid', '40.414810716610795, -3.70286565939538', '2021-1-1', '2023-12-31', 1, 'N/A', 'N/A'),
        (3,'Circuito termal y masaje en Hotel Termes La Garriga 4º', 'Blablabla', 55, 'Barcelona', '41.68374125407305, 2.2858926234390764', '2022-10-1', '2021-12-31', 1, 'N/A', 'N/A'),
        (4,'Circuito Multiaventura', 'Blablabla', 70, 'Deltebre, Tarragona', '40.70882886402804, 0.8155672420375231', '2021-1-1', '2022-12-10', 0, 'N/A', 'N/A'),
        (4,'Visita al Zoo de Cañada Verde', 'Blablabla', 89, 'Hornachuelos, Córdoba', '37.82259435401107, -5.256658086444123', '2021-1-1', '2022-12-31', 0, 'N/A', 'N/A');`);

        console.log('Populate rows... done');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

populateData();
