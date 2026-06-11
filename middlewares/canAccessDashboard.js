'use strict';

const canAccessDashboard = (req, res, next) => {
    const { role } = req.userAuth;

    if (role !== 'admin' && role !== 'viewer') {
        const error = new Error('Acceso restringido a administradores');
        error.httpStatus = 403;
        return next(error);
    }

    return next();
};

module.exports = canAccessDashboard;
