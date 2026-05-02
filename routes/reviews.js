const express = require('express');

const { reviewList, reviewNew, reviewGet } = require('../controllers/reviews');

const isAuth = require('../middlewares/isAuth');
const bookingExists = require('../middlewares/bookingExists');
const canVote = require('../middlewares/canVote');

const router = express.Router();

// Crear una nueva opinión sobre una reserva ya disfrutada.
router.post('/:ticketNumber', isAuth, bookingExists, canVote, reviewNew);

// Listar opiniones globales o filtradas por idExperiencia mediante query
router.get('/', reviewList);

// Obtener la calificación media de una experiencia a través de /ratingExp?idExp=ID
router.get('/ratingExp', reviewGet);

module.exports = router;
