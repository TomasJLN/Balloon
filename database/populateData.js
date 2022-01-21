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
        INSERT INTO experience (idCategory, title, description, price, location, coords, photo, startDate, endDate, featured, conditions,normatives)
        VALUES
          (1,'Vuelo en Parapente con video', 'Blablabla', 55, 'Tarragona', '41.2123104650502, 0.9792378651733277', 'parapente.png' ,'2022-1-1', '2022-5-24', 0, 'N/A', 'N/A'),
          (1,'Vuelo en helicóptero', 'Blablabla', 77.90, 'Barcelona', '41.525247886651314, 1.97095384168887', 'helicoptero.jpg','2021-12-15', '2022-3-16', 0, 'N/A', 'N/A'),
		  (1,'Vuelo en túnel de Viento', 'Blablabla', 89, 'Barcelona', '41.34880631465778, 2.0749911983021305', 'tunel3.jpg','2022-1-1', '2022-5-31', 1, 'N/A', 'N/A'),
          (1,'Vuelo en globo', 'Blablabla', 170.00, 'Segovia', '40.94531758733573, -4.1316637968483905', 'globo.jpg','2022-1-12', '2022-5-20', 1, 'N/A', 'N/A'),
          (2,'Cena con las estrellas en el Observatori Fabra', 'Blablabla', 75, 'Barcelona', '41.418569935370584, 2.1241799983040273', 'fabra.jpg','2022-1-1', '2022-12-31', 1, 'N/A', 'N/A'),
          (2,'Cata de cervezas y degustación de quesos', 'Blablabla', 25, 'Madrid', '40.41669509716843, -3.678061492369516', 'quesos.jpg','2021-1-1', '2023-1-31', 0, 'N/A', 'N/A'),
          (2,'Curso de arroces con degustación', 'Blablabla', 50, 'Madrid', '40.41381711913654, -3.710419667858455', 'arroces.png','2021-11-1', '2022-4-12', 1, 'N/A', 'N/A'),
          (3,'Circuito Onsen Spa y Masaje en Esenzias', 'Blablabla', 108, 'Madrid', '40.414810716610795, -3.70286565939538', 'spa1.jpg','2021-1-1', '2022-12-31', 1, 'N/A', 'N/A'),
          (3,'Circuito termal y masaje en Hotel Termes La Garriga 4º', 'Blablabla', 55, 'Barcelona', '41.68374125407305, 2.2858926234390764', 'spa2.jpg','2022-10-1', '2022-12-31', 1, 'N/A', 'N/A'),
          (4,'Circuito Multiaventura', 'Blablabla', 70, 'Deltebre, Tarragona', '40.70882886402804, 0.8155672420375231', 'kayak2.jpg','2022-1-1', '2022-12-10', 0, 'N/A', 'N/A'),
          (4,'Visita al Zoo de Cañada Verde', 'Blablabla', 89, 'Hornachuelos, Córdoba', '37.82259435401107, -5.256658086444123', 'NA.png','2022-1-1', '2022-12-31', 0, 'N/A', 'N/A'),
          (1,'Excursión en kayak en el Parque Natural de los Acantilados de Cerro Gordo-Maro', 'Vea los acantilados de Maro-Cerro Gordo desde un kayak y disfrute de vistas', 30, 'Almuñécar', '36.73244173395789, -3.739712197177824', 'kayak1.jpg', '2022-01-07', '2022-12-30', 1,	'No es recomendable para viajeros con problemas de espalda', 'Uso de máscara facial obligatorio para los guías en todas las áreas públicas.'),
          (4, 'Senderismo en Montserrat y Visita al Monasterio con un Guía Local', 'Montserrat (también conocida como la "Montaña serrada"), es una gigantesca formación rocosa que alberga un Monasterio benedictino en la cima. Esta excursión le ofrece transporte de ida y vuelta desde Barcelona', 65, 'Barcelona', '41.59381784742324, 1.83749601744597', 'senderismo1.jpg','2022-1-7', '2022-12-30', 1, 'Los viajeros deben tener una condición física media', 'N/A'),
          (4, 'Excursión en barco de avistamiento de ballenas y delfines desde Los Cristianos', 'Descubra la belleza del océano Atlántico en esta excursión en barco Bahriyeli desde el puerto de Los Cristianos', 25, 'Arona', '28.050395957190595, -16.717772503072286'	,'delfines1.jpg', '2022-1-7', '2022-12-30', 1, 'N/A', 'N/A'),
          (1, 'Lanzamiento de Hacha 1h',	'El Hachazo fue el primer lugar abierto en España donde se practica el tiro de hacha. Te enseñaremos el arte del lanzamiento de hacha y las normas de seguridad.', 19.2, 'Madrid', '40.40572572279367, -3.67865994427823', 'lanzamientoHacha.jpg', '2022-1-7', '2022-12-30', 1, 'N/A', 'N/A'),
          (1, 'Canyoning Rio Verde', 'I am an Andalusian who has over 10 year of experience in adventure tourisme. I am a qualified technician in hiking, climbing and canyoning. I am a happy and communicative person.', 66, 'Nerja', '36.783982635738425, -3.880430145728457', 'NA.png','2022-1-7', '2022-12-30', 10, 'N/A', 'N/A'),
          (3, 'Circuito Spa y Cena para dos en Royal Hideaway Sancti Petri Spa', 'N/A', 125, 'Chiclana de la Frontera', '36.4051466269535, -6.145741061503644','spa3.jpg', '2022-4-8', '2022-9-30', 1, 'Es necesario llevar traje de baño, gorro, chanclas y toalla. El gorro y chanclas se pueden comprar en el spa y la toalla se puede alquilar a 1€, a pagar directamente en el spa.', 'N/A'),
          (3, 'Circuito Spa para dos en Centro Spaxión', 'Encontraréis el spa en pleno centro y a 5 minutos a pie del casco histórico de la ciudad', 54, 'Pontevedra', '42.43129694266837, -8.638959886563221', 'NA.png','2022-1-7', '2022-12-30', 1, 'Obligatorio adquirir el gorro y las chanclas en el centro por 3€', 'N/A'),
          (1, 'Trío de Coches: Ferrari, Lamborghini y Porsche + Vuelta en Coche de Alta',	'¡Conduce tres coches! Ponte a los mandos de un Ferrari, un Lamborghini y un Porsche en esta experiencia sin igual.', 129, 'Zaragoza', '41.082902105408174, -0.20355409994388327', 'spa2.jpg','2022-1-7', '2022-12-30', 1, 'N/A', 'N/A'),
          (2, 'Visita a Bodegas Martín Códax con Cata de 2 Vinos', 'Conoceréis de primera mano el mundo del vino y su cultura gracias a la visita guiada que realizaréis por las bodegas.', 17.9, 'Pontevedra',	'42.520273876136194, -8.792415459572137','cataVinos1.jpg', '2022-1-7', '2022-12-30',1, 'Los menores de edad podrán visitar la bodega acompañados de un tutor', 'N/A'),
          (1, 'Vuelo en Globo con Desayuno, Cava y Vídeo', 'N/A', 160, 'Arcos de la Frontera', '37.41097178828611, -6.076662523634975','globo.jpg', '2022-6-1', '2022-8-31', 5, 'N/A', 'N/A'),
          (1, 'Alas para dos: Túnel de Viento para dos en Windobona', 'Probad una experiencia completamente nueva y liberad toda la adrenalina con un vuelo en el Túnel de Viento para dos personas en Windobona.', 89, 'Madrid', '40.36424687471279, -3.739927357773669','tunelViento.png' ,'2022-1-7', '2022-12-30', 1, 'Es necesario llevar zapatillas de deporte limpias y bien sujetas', 'N/A');`);

        console.log('Populate rows... done');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

populateData();
