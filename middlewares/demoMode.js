'use strict';

const isDemoMode = () => process.env.DEMO_MODE !== 'false';

const demoAccountOnly = (req, res, next) => {
    if (!isDemoMode()) return next();

    const email = req.body?.email?.trim().toLowerCase();

    if (email?.endsWith('@demo.com')) return next();

    return res.status(403).send({
        status: 'error',
        message: 'Esta aplicación solo admite cuentas ficticias de demostración',
    });
};

const demoWriteDisabled = (req, res, next) => {
    if (!isDemoMode()) return next();

    return res.status(403).send({
        status: 'error',
        message: 'Función deshabilitada en la demostración académica',
    });
};

module.exports = { demoAccountOnly, demoWriteDisabled, isDemoMode };
