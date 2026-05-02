const express = require('express');

const {
    experienceFeatured,
    occupiedFilter,
    categoriesFilter,
    allFilters,
} = require('../filters');

const router = express.Router();

// Filtro de experiencias ocupadas (plazas ocupadas)
router.get('/occupied', occupiedFilter);

// Filtro de experiencias destacadas
router.get('/featured', experienceFeatured);

// Filtro de categorías disponibles
router.get('/categories', categoriesFilter);

// También exponemos el filtro completo bajo /all si el cliente desea
// acceder mediante /filters/all en vez de /allFilter. Esto mantiene
// compatibilidad hacia atrás permitiendo ambas rutas.
router.get('/all', allFilters);

module.exports = router;
