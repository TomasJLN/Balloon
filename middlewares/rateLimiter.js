'use strict';

const rateLimit = require('express-rate-limit');

// Limiter estricto para login: 10 intentos cada 15 minutos
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo en 15 minutos.',
    },
});

// Limiter para registro: 5 cuentas cada hora por IP
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Demasiados registros desde esta IP. Inténtalo de nuevo en 1 hora.',
    },
});

// Limiter para recuperación de contraseña: 5 intentos cada 15 minutos
const recoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Demasiados intentos de recuperación. Inténtalo de nuevo en 15 minutos.',
    },
});

const registerEmailAttempts = new Map();

// Limiter adicional por email normalizado. Ayuda contra abuso con IPs rotatorias
// que intentan registrar repetidamente la misma dirección.
const registerEmailLimiter = (req, res, next) => {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email) return next();

    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const max = 3;
    const current = registerEmailAttempts.get(email);

    if (!current || current.resetAt <= now) {
        registerEmailAttempts.set(email, {
            count: 1,
            resetAt: now + windowMs,
        });
        return next();
    }

    if (current.count >= max) {
        return res.status(429).json({
            status: 'error',
            message: 'Demasiados intentos de registro para este email. Inténtalo de nuevo en 1 hora.',
        });
    }

    current.count += 1;
    registerEmailAttempts.set(email, current);
    return next();
};

setInterval(() => {
    const now = Date.now();
    for (const [email, attempt] of registerEmailAttempts.entries()) {
        if (attempt.resetAt <= now) registerEmailAttempts.delete(email);
    }
}, 15 * 60 * 1000).unref();

module.exports = {
    loginLimiter,
    registerLimiter,
    registerEmailLimiter,
    recoveryLimiter,
};
