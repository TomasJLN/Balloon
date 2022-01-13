'use strict';

const exec = require('child_process').exec;

function createDB() {
    try {
        const createDB = exec('sh database/create_db.sh');
        createDB.stdout.on('data', (data) => {
            if (data[0] === '0')
                console.log('Database balloon_db sucessfully created!!');
            else console.log('There was an error!');
        });
        createDB.stderr.on('data', (data) => {
            console.error(data);
        });
    } catch (error) {
        console.error(error.message);
    }
}

createDB();
