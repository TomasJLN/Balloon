require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

// en Express5 app.listen pasa los errores a este callback
const server = app.listen(PORT, (error) => {
    if (error) {
        throw error; // ej. puerto en uso
    }
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = server;
