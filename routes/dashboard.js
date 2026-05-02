const express = require('express');

const monthCharged = require('../dashboard_querys/monthCharged.js');
const bestExperiences = require('../dashboard_querys/bestExperiences.js');
const totalUsers = require('../dashboard_querys/totalUsers.js');
const monthlyRevenue = require('../dashboard_querys/monthlyRevenue.js');
const bookingsByCategory = require('../dashboard_querys/bookingsByCategory.js');

const router = express.Router();

router.get('/', monthCharged);
router.get('/bestExp', bestExperiences);
router.get('/totalUsers', totalUsers);
router.get('/monthlyRevenue', monthlyRevenue);
router.get('/bookingsByCategory', bookingsByCategory);

module.exports = router;
