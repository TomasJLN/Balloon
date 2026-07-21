const express = require('express');

const {
    newsletterNew,
    newsletterDelete,
} = require('../controllers/newsletter');

const router = express.Router();
const { demoWriteDisabled } = require('../middlewares/demoMode');

// Suscribir a newsletter
router.post('/', demoWriteDisabled, newsletterNew);

// Dar de baja de newsletter
router.delete('/', demoWriteDisabled, newsletterDelete);

module.exports = router;
