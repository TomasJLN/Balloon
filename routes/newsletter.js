const express = require('express');

const {
    newsletterNew,
    newsletterDelete,
} = require('../controllers/newsletter');

const router = express.Router();

// Suscribir a newsletter
router.post('/', newsletterNew);

// Dar de baja de newsletter
router.delete('/', newsletterDelete);

module.exports = router;
