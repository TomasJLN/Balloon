'use strict';

/** Requirements **/
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const getDB = require('./getDB');

const { MYSQL_DATABASE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

async function initializeDB() {
    let connection;

    try {
        connection = await getDB();
        await connection.query(`DROP DATABASE IF EXISTS ${MYSQL_DATABASE};`);
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`
        );
        await connection.query(`USE ${MYSQL_DATABASE};`);
        console.clear();
        console.log('Clear DB... done!');

        console.log('Creating tables...');
        //Create table user
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
            role ENUM("admin", "user") DEFAULT "user" NOT NULL, 
            recoveryCode VARCHAR(150),
            registryCode VARCHAR(150), 
            createdAt DATETIME DEFAULT now(), 
            modifiedAt DATETIME);
        `);

        //Create table category
        await connection.query(`
        CREATE TABLE IF NOT EXISTS category (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
            title VARCHAR(50) UNIQUE NOT NULL, 
            description VARCHAR(255),
            photo varchar(50),
            active BOOLEAN DEFAULT true,
            createdAt DATETIME DEFAULT now()
            );
        `);

        //Create table experience
        await connection.query(`
        CREATE TABLE IF NOT EXISTS experience (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            idCategory INT UNSIGNED NOT NULL, FOREIGN KEY (idCategory) REFERENCES category(id) ON UPDATE CASCADE,
            title VARCHAR(150) NOT NULL,
            description VARCHAR(255), 
            price DECIMAL(6,2) NOT NULL, 
            location VARCHAR(100) NOT NULL, 
            coords VARCHAR(100), 
            photo varchar(50), 
            startDate DATETIME,
            endDate DATETIME,
            active BOOLEAN DEFAULT true,
            featured BOOLEAN DEFAULT false,
            totalPlaces TINYINT UNSIGNED NOT NULL DEFAULT 10,
            conditions VARCHAR(255),
            normatives VARCHAR(255),
            createdAt DATETIME NOT NULL DEFAULT now(),
            modifiedAt DATETIME
            );
        `);

        //Create table booking
        await connection.query(`
        CREATE TABLE IF NOT EXISTS booking (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            idExperience INT UNSIGNED NOT NULL, FOREIGN KEY (idExperience) REFERENCES experience(id) ON UPDATE CASCADE ON DELETE CASCADE,
            idUser INT UNSIGNED NOT NULL, FOREIGN KEY (idUser) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE,
            ticket VARCHAR(20) NOT NULL UNIQUE,
            expired BOOLEAN DEFAULT false,
            createdAt DATETIME NOT NULL DEFAULT now()
            );
        `);

        //Create table booking_experience
        await connection.query(`
        CREATE TABLE IF NOT EXISTS booking_experience (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            dateExperience DATETIME NOT NULL,
            quantity TINYINT UNSIGNED NOT NULL DEFAULT 1,
            totalPrice DECIMAL(6,2) NOT NULL,
            idBooking INT UNSIGNED NOT NULL, FOREIGN KEY (idBooking) REFERENCES booking(id) ON UPDATE CASCADE ON DELETE CASCADE,
            idExperience INT UNSIGNED NOT NULL,
            idUser INT UNSIGNED NOT NULL
            );
            `);

        //Create table qr
        await connection.query(`
            CREATE TABLE IF NOT EXISTS qr (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                idBooking INT UNSIGNED NOT NULL, FOREIGN KEY (idBooking) REFERENCES booking(id) ON UPDATE CASCADE ON DELETE CASCADE,
                qrPicture VARCHAR(50) NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT now()
                );
                `);

        //Create table review
        await connection.query(`
                  CREATE TABLE IF NOT EXISTS review (
                      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                      idBookingExperience INT UNSIGNED NOT NULL, FOREIGN KEY (idBookingExperience) REFERENCES booking_experience(idBooking) ON UPDATE CASCADE ON DELETE CASCADE,
                      description VARCHAR(255),
                      score TINYINT UNSIGNED NOT NULL DEFAULT 60,
                      voted BOOLEAN NOT NULL DEFAULT false,
                      createdAt DATETIME NOT NULL DEFAULT now()
                      );
                      `);

        //Create table newsletter
        await connection.query(`
        CREATE TABLE IF NOT EXISTS newsletter (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) NOT NULL UNIQUE,
            active BOOLEAN DEFAULT true,
            removed BOOLEAN DEFAULT false
            );
        `);

        await connection.query('SET FOREIGN_KEY_CHECKS=1');
        console.log('DB setup... done!');

        console.log('Adding Administator account...');
        const passwordEncrypted = await bcrypt.hashSync(
            ADMIN_PASSWORD,
            saltRounds
        );

        await connection.query(`
        INSERT INTO user (name, surname, email, password, active, role)
        values 
       ('Admin', 'Admin', "${ADMIN_EMAIL}", "${passwordEncrypted}", true, 'admin');`);

        console.log('Administrator account... done');

        console.log('Finished.');
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

initializeDB();
