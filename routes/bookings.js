const express = require('express');

const {
    bookingNew,
    bookingCancel,
    bookingList,
    bookingGet,
    bookingGetQR,
} = require('../controllers/bookings');

const isAuth = require('../middlewares/isAuth');
const bookingExists = require('../middlewares/bookingExists');

const router = express.Router();

// Crear nueva reserva (requiere autenticación)
router.post('/', isAuth, bookingNew);

// Listar todas las reservas activas (requiere autenticación de administrador)
router.get('/list', isAuth, bookingList);

// Obtener los datos de una reserva
router.get('/view/:idBooking', isAuth, bookingGet);

// Obtener los datos de una reserva mediante ID para generar QR
router.get('/view/qr/:idBooking', isAuth, bookingGetQR);

// Obtener los datos de la reserva actual (puede usarse sin id)
router.get('/view', isAuth, bookingGet);

// Cancelar una reserva a partir del número de ticket (requiere autenticación)
router.delete('/:ticketNumber', isAuth, bookingExists, bookingCancel);

module.exports = router;
