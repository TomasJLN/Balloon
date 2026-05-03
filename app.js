const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const sharp = require('sharp');
const { ensureDir, pathExists } = require('fs-extra');
require('dotenv').config();

// Rutas importadas
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const experienceRoutes = require('./routes/experiences');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const filterRoutes = require('./routes/filters');
const newsletterRoutes = require('./routes/newsletter');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

if (process.env.TRUST_PROXY) {
    app.set('trust proxy', Number(process.env.TRUST_PROXY));
}

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) =>
    !origin || corsOrigins.includes('*') || corsOrigins.includes(origin);

const getCorsOrigin = (origin) => {
    if (corsOrigins.includes('*')) return '*';
    return isAllowedOrigin(origin) ? origin : corsOrigins[0];
};

// Seguridad y rendimiento
app.use(helmet());
app.use(compression());
// CORS configurable
app.use(
    cors({
        origin(origin, callback) {
            if (isAllowedOrigin(origin)) return callback(null, true);
            return callback(new Error('Origen no permitido por CORS'));
        },
    })
);
// Logging de peticiones
app.use(morgan('dev'));
// Parseo automático de JSON
app.use(express.json());
app.use('/uploads', (req, res, next) => {
    // Esto asegura que la cabecera CORS esté en la respuesta de la imagen
    res.header('Access-Control-Allow-Origin', getCorsOrigin(req.headers.origin));

    // **CLAVE:** Si el error persiste, la cabecera 'Cross-Origin-Resource-Policy' (establecida por helmet)
    // está bloqueando la imagen. Para imágenes, debería ser 'cross-origin'.
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');

    // Continuar con el siguiente middleware (express.static)
    next();
});
// Manejo de subida de archivos (limite de 50MB)
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        abortOnLimit: true,
        responseOnLimit: 'Archivo demasiado grande',
    }),
);

app.get('/uploads/thumbs/sm/:photo', async (req, res, next) => {
    try {
        const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIRECTORY);
        const thumbsSmDir = path.join(uploadsDir, 'thumbs', 'sm');
        const photo = path.basename(req.params.photo);
        const sourcePath = path.join(uploadsDir, photo);
        const thumbPath = path.join(thumbsSmDir, `${photo}.webp`);

        if (!(await pathExists(sourcePath))) {
            return res.status(404).json({ status: 'error', message: 'Imagen no encontrada' });
        }

        await ensureDir(thumbsSmDir);

        if (!(await pathExists(thumbPath))) {
            await sharp(sourcePath)
                .resize({ width: 340, withoutEnlargement: true })
                .webp({ quality: 68 })
                .toFile(thumbPath);
        }

        res.header('Access-Control-Allow-Origin', getCorsOrigin(req.headers.origin));
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        res.header('Cache-Control', 'public, max-age=2592000');
        res.type('webp').sendFile(thumbPath);
    } catch (error) {
        next(error);
    }
});

app.get('/uploads/thumbs/:photo', async (req, res, next) => {
    try {
        const uploadsDir = path.join(__dirname, process.env.UPLOADS_DIRECTORY);
        const thumbsDir = path.join(uploadsDir, 'thumbs');
        const photo = path.basename(req.params.photo);
        const sourcePath = path.join(uploadsDir, photo);
        const thumbPath = path.join(thumbsDir, `${photo}.webp`);

        if (!(await pathExists(sourcePath))) {
            return res.status(404).json({ status: 'error', message: 'Imagen no encontrada' });
        }

        await ensureDir(thumbsDir);

        if (!(await pathExists(thumbPath))) {
            await sharp(sourcePath)
                .resize({ width: 420, withoutEnlargement: true })
                .webp({ quality: 72 })
                .toFile(thumbPath);
        }

        res.header('Access-Control-Allow-Origin', getCorsOrigin(req.headers.origin));
        res.header('Cross-Origin-Resource-Policy', 'cross-origin');
        res.header('Cache-Control', 'public, max-age=2592000');
        res.type('webp').sendFile(thumbPath);
    } catch (error) {
        next(error);
    }
});

// Servir ficheros estáticos
app.use('/uploads', express.static('static/uploads'));

// Registro de rutas
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/experience', experienceRoutes);
app.use('/booking', bookingRoutes);
app.use('/review', reviewRoutes);
app.use('/filters', filterRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/dashboard', dashboardRoutes);

// Mantener compatibilidad con el endpoint v1 /allFilter
const { allFilters } = require('./filters');
app.get('/allFilter', allFilters);

// Middleware de error unificado
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.httpStatus || err.status || 500;
    const message = err.message || 'Error interno del servidor';
    res.status(status).json({ status: 'error', message });
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'No encontrado' });
});

module.exports = app;
