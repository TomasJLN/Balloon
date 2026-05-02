const express = require('express');

const {
    experienceNew,
    experiencePhotoUpload,
    experienceDelete,
    experienceEdit,
    experienceGet,
    experienceList,
} = require('../controllers/experiences');

const { experienceFeatured } = require('../filters');

const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// Crear nueva experiencia (requiere autenticación con rol de administrador)
router.post('/', isAuth, experienceNew);

// Listar todas las experiencias activas
router.get('/list', experienceList);

// Listar experiencias destacadas (filtro)
router.get('/featured', experienceFeatured);

// Subir/actualizar foto de experiencia (requiere autenticación)
router.put('/:idExperience/photo', isAuth, experiencePhotoUpload);

// Actualizar una experiencia (requiere autenticación)
router.put('/:idExperience', isAuth, experienceEdit);

// Eliminar (desactivar) una experiencia (requiere autenticación)
router.delete('/:idExperience', isAuth, experienceDelete);

// Obtener los datos de una experiencia
router.get('/:idExperience', experienceGet);

module.exports = router;
