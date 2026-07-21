const express = require('express');

const {
    categoryNew,
    categoryEdit,
    categoryGet,
    categoryList,
    categoryDelete,
    categoryPhotoUpload,
} = require('../controllers/categories');

const isAuth = require('../middlewares/isAuth');
const { demoWriteDisabled } = require('../middlewares/demoMode');

const router = express.Router();

// Crear una nueva categoría (requiere autenticación)
router.post('/', demoWriteDisabled, isAuth, categoryNew);

// Listar todas las categorías activas
router.get('/', categoryList);

// Obtener la información de una categoría específica (requiere autenticación)
router.get('/:idCategory', isAuth, categoryGet);

// Actualizar una categoría (requiere autenticación)
router.put('/:idCategory', demoWriteDisabled, isAuth, categoryEdit);

// Eliminar una categoría (requiere autenticación)
router.delete('/:idCategory', demoWriteDisabled, isAuth, categoryDelete);

// Subir/actualizar la foto de una categoría (requiere autenticación)
router.put('/:idCategory/photo', demoWriteDisabled, isAuth, categoryPhotoUpload);

module.exports = router;
