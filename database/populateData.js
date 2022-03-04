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
        INSERT INTO category (title, description, photo) values 
        ('Aventura', 'Atrévete a saltar en paracaídas o sin él, buceo con tiburones, un salto de puenting, rafting, nodejs y más.',	'5bd148d3-e7f5-4350-b328-bdbcc00cdaa5.jpg'),
        ('Gourmet',	'Experimenta nuevos sabores, prueba las nuevas cervezas artesanales fermentadas en el retrete, catas de vinos con taxi para la vuelta incluído.' ,'1dc0d9a9-b596-4d55-976d-e060ed43b49b.jpg'),
        ('Relax', 'Las mejores experiencias en Spa, baños turcos, baños árabes, bañeras y mucho más.', '2745c6b4-79e7-4639-956d-9331ecbb6ea8.jpg'),
        ('Naturaleza',	'Camina con osos pardos, recoge setas venenosas, chupa piel de sapo y más.', '7b8fea88-f038-42a7-b78c-29a6109dcdc7.jpg');
        `);

        //Create table experience
        await connection.query(`
        INSERT INTO experience (idCategory, title, description, price, location, coords, photo, startDate, endDate, active, featured, totalPlaces, conditions, normatives)
        VALUES
        (1, 'Vuelo en Parapente con video', 'Blablabla', 55, 'Tarragona', '41.24192461416068,0.948559', 'parapente.png', '2022-01-01', '2022-05-24', 1, 0, 10, 'Peso máximo: 110 kg', 'Es necesario llevar ropa de abrigo, protección solar y agua'),
        (1,	'Vuelo en helicóptero',	'Ahora tienes la oportunidad de ver la ciudad de Barcelona de una manera completamente nueva', 77.9, 'Barcelona', '41.36031140114586,2.1802289100901384', 'helicoptero.jpg', '2022-12-15', '2022-03-16', 1,	0, 10, 'Peso máximo: 130 kilos En caso de superar los 110 kg, el participante deberá pagar 2 plazas', 'N/A'),
        (1,	'Vuelo en túnel de Viento',	'Prepárate para vivir una de las experiencias más emocionantes que te puedas imaginar. ¡Vuela en un túnel del viento en Barcelona!', 89, 'Barcelona', '41.34898735362118,2.0751412037014574', 'tunel3.jpg', '2022-01-01', '2022-05-31',	1,	1,	10,	'- No se puede volar bajo los efectos del alcohol o estupefacientes. El personal invitará a abandonar el túnel a quien se encuentre bajo estas circunstancias.', 'N/A'),
        (1,	'Vuelo en globo', 'Disfruta de un paseo por las nubes con este paseo en globo por Segovia. Si eres un amante de la naturaleza y te gusta admirar los paisajes, ¡esta es tu experiencia! Además podrás llevarte a casa el vídeo del vuelo para que nunca lo olvides.',	170,	'Segovia',	'40.944759253468284,-4.127564942627999',	'64388097-a29d-4806-b6ba-d5788a2f2304.jpg',	'2022-01-12', '2022-05-20',	1,	1,	10,	'Se recomienda llevar ropa y calzado cómodo', 'N/A'),
        (2,	'Cena con las estrellas en el Observatori Fabra', '¿Tenéis ganas de hacer algo diferente? Preparaos para disfrutar de una velada inolvidable con esta cena con las estrellas en el Observatorio de Fabra.',	75,	'Barcelona',	'41.418539705715204,2.1241767460298204',	'fabra.jpg',	'2022-01-01',	'2022-12-31',	1,	1,	10,	 'El Observatorio Fabra tiene una temperatura de hasta 6º menos que la del centro de Barcelona. No olvide llevar alguna pieza de abrigo', 'N/A'),
        (2,	'Cata de cervezas y degustación de quesos', '- Breve historia de la cerveza, orígenes, la edad media, la cerveza en la actualidad - Elaboración de los diferentes tipos de cerveza - Estilos de cerveza Ale - Estilos de cerveza Lager - Cervezas Lambic y maduradas',	25,	'Madrid',	'40.431531446157884,-3.671625685672846',	'quesos.jpg',	'2022-01-01',	'2023-01-31',	1,	0,	10,	'Edad minima: 18 años', 'N/A'),
        (2,	'Curso de arroces con degustación', 'Durante el taller se cocinarán 3 arroces: un arroz caldoso de mar y montaña (arroz redondo categoria extra), un arroz negro con sepia y alioli (arroz bomba) y un risotto de boletus (arroz arborio)',	50,	'Madrid',	'40.389296368720174,-3.7427093558209084',	'arroces.png',	'2022-11-01',	'2022-04-12',	1,	1,	10,	'N/A',	'N/A'),
        (3,	'Circuito Onsen Spa y Masaje en Esenzias', 'Adentraos en un spa japonés en pleno centro de Madrid: Esenzias Spa. Cuidad vuestro bienestar de una forma original y que os dejará totalmente renovados.',	108,	'Madrid',	'40.414813911017525,-3.702844',	'f5e49a98-a560-4a50-a5b1-7d036884d5fa.jpg',	'2022-01-01',	'2022-12-31',	1,	1,	10,	 'Es necesario llevar bañador y goma para llevar el pelo recogido. El centro proporciona albornoz y zapatillas.', 'N/A'),
        (3,	'Circuito termal y masaje en Hotel Termes La Garriga 4º', '¡Piensa en ti y en tu bienestar con esta experiencia que no podrás dejar escapar! Disfruta de un Circuito Termal y un masaje en La Garriga. ¡Seguro que te encanta!', 55, 'Barcelona', '41.681571199289436,2.27904580865751', '43274220-dc40-4665-9381-ae8c8ca732b5.jpg', '2022-10-01', '2022-12-31', 1, 1, 10, 'Es necesario llevar traje de baño, toalla y chanclas para hacer uso del circuito termal.', 'N/A'),
        (4,	'Circuito Multiaventura. Almuerzo, Parasailing y Moto de Agua', '¿Tienes ganas de disfrutar de un completo día de actividades acuáticas?',	200, 'Salou', '41.06928274247286,1.1791299074064623', '4c238d42-aeaa-4ac0-a9c8-a559d5620879.jpg', '2022-01-01', '2022-12-10', 1,	0,	10, 'Es necesario saber nadar.', 'Edad mínima: 12 años. Los menores de 18 años deben ir acompañados de un adulto'),
        (4,	'Visita al Zoo de Cañada Verde', 'Conoced Cañada Verde y disfrutad de una Visita al Zoo de Animales Autóctonos y al Parque Multiaventuras. Todo esto en Hornachuelos, Córdoba.', 30, 'Hornachuelos, Córdoba', '37.82326388434454,-5.256443507940359', 'a341ed7d-e9f4-4aa9-b0e0-6120bae805e1.jpg', '2022-01-01',	'2022-12-31', 1, 0, 10,	'Edad mínima: 3 años Los menores de 8 años deben ir acompañados de un adulto','N/A'),
        (1,	'Excursión en kayak en el Parque Natural de los Acantilados de Cerro Gordo-Maro', 'Vea los acantilados de Maro-Cerro Gordo desde un kayak y disfrute de vistas',	30,	'Almuñécar',	'36.74638439528105,-3.7815815710931373',	'kayak1.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	'No es recomendable para viajeros con problemas de espalda', 'Uso de máscara facial obligatorio para los guías en todas las áreas públicas.'),
        (4,	'Senderismo en Montserrat y Visita al Monasterio', 'Montserrat (también conocida como la "Montaña serrada"), es una gigantesca formación rocosa que alberga un Monasterio benedictino en la cima. Esta excursión le ofrece transporte de ida y vuelta desde Barcelona',	65,	'Barcelona',	'41.60915105491232,1.818414647959166',	'senderismo1.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	'Los viajeros deben tener una condición física media', 'N/A'),
        (4,	'Excursión en barco de avistamiento de ballenas y delfines desde Los Cristianos', 'Descubra la belleza del océano Atlántico en esta excursión en barco Bahriyeli desde el puerto de Los Cristianos',	25,	'Arona',	'28.048213504335717,-16.716593063522875',	'delfines1.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	 'Esta experiencia es apta solo para adultos', 'Se recomienda llevar bañador, toalla, gorra, gafas de sol, crema solar y ropa de abrigo por si refresca'),
        (1,	'Lanzamiento de Hacha 1h', 'El Hachazo fue el primer lugar abierto en España donde se practica el tiro de hacha. Te enseñaremos el arte del lanzamiento de hacha y las normas de seguridad.', 19.2, 'Madrid', '40.40634722788905,-3.678616500553418',	'lanzamientoHacha.jpg',	'2022-01-07', '2022-12-30',	1,	1,	10,	'Edad mínima: 18 años',	'Es necesario llevar calzado cerrado para realizar la actividad. Prohibido llevar comida o bebida, salvo agua en botella transparente'),
        (1,	'Barranquismo (León)', 'Te proponemos que descubras esta increíble actividad en el barranco de Cacabillos, hecho de roca cuarcita, ideal para iniciarse en el deporte del descenso de barrancos.',	49,	'Villamanín - León',	'42.92928413361034,-5.807957671879364',	'f9d12826-46ee-4250-91dc-2ed6ed323c5e.jpg',	'2022-01-07',	'2022-12-30',	1,	10,	10,	 'Es necesario llevar traje de baño, botas de montaña o calzado deportivo y toalla', 'N/A'),
        (3,	'Circuito Spa y Cena para dos en Royal Hideaway Sancti Petri Spa', 'Preparaos para descubrir uno de los spas más impresionantes de Andalucía. ¡Adentraos en el Circuito Spa del Royal Hideaway Sancti Petri Spa & Resort y conoced la auténtica relajación en Cádiz!',	125,	'Chiclana de la Frontera',	'36.4051466269535,-6.145741061503644',	'cd187416-4263-4f89-b434-38d67d876f48.jpg',	'2022-04-08',	'2022-09-30',	1,	1,	10,	'Es necesario llevar traje de baño, gorro, chanclas y toalla. El gorro y chanclas se pueden comprar en el spa y la toalla se puede alquilar a 1€, a pagar directamente en el spa.',	'N/A'),
        (3,	'Circuito Spa para dos en Centro Spaxión',	'Encontraréis el spa en pleno centro y a 5 minutos a pie del casco histórico de la ciudad',	54,	'Pontevedra',	'42.43130236535369,-8.639184542328364',	'c2b68959-d438-4802-88fc-316d10bc348c.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	'Obligatorio adquirir el gorro y las chanclas en el centro por 3€',	'N/A'),
        (1,	'Trío de Coches: Ferrari, Lamborghini y Porsche + Vuelta en Coche de Alta',	'¡Conduce tres coches! Ponte a los mandos de un Ferrari, un Lamborghini y un Porsche en esta experiencia sin igual.',	129,	'Zaragoza',	'41.080462588344844,-0.20430562846484984',	'3aa38e26-63d5-4a8e-9165-c854cc437379.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	'N/A',	'N/A'),
        (2,	'Visita a Bodegas Martín Códax con Cata de 2 Vinos', 'Conoceréis de primera mano el mundo del vino y su cultura gracias a la visita guiada que realizaréis por las bodegas.',	17.9,	'Pontevedra',	'42.520273876136194,-8.792415459572137',	'cataVinos1.jpg',	'2022-01-07',	'2022-12-30',	1,	1,	10,	'Los menores de edad podrán visitar la bodega acompañados de un tutor', 'N/A'),
        (1,	'Vuelo en Globo con Desayuno, Cava y Vídeo', 'Disfruta de un paseo por el cielo de Arcos de la Frontera y guarda un recuerdo único para toda la vida.',	160,	'Arcos de la Frontera',	'36.75431372445721,-5.808155831697719',	'globo.jpg',	'2022-06-01',	'2022-08-31',	1,	1,	10,	'La experiencia no la pueden realizar personas que no gocen de buena saludSe recomienda una altura mínima de 1,15m', 'N/A'),
        (1, 'Alas para dos: Túnel de Viento para dos en Windobona', 'Probad una experiencia completamente nueva y liberad toda la adrenalina con un vuelo en el Túnel de Viento para dos personas en Windobona.', 89, 'Madrid',	'40.36413200993128,-3.739990220895459',	'tunelViento.png', '2022-01-07', '2022-12-30',	1,	1,	10,	'Es necesario llevar zapatillas de deporte limpias y bien sujetas',	'N/A')`);

        console.log('Populate rows... done');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

populateData();
