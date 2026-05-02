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

const router = express.Router();

// Crear una nueva categoría (requiere autenticación)
router.post('/', isAuth, categoryNew);

// Listar todas las categorías activas
router.get('/', categoryList);

// Obtener la información de una categoría específica (requiere autenticación)
router.get('/:idCategory', isAuth, categoryGet);

// Actualizar una categoría (requiere autenticación)
router.put('/:idCategory', isAuth, categoryEdit);

// Eliminar una categoría (requiere autenticación)
router.delete('/:idCategory', isAuth, categoryDelete);

// Subir/actualizar la foto de una categoría (requiere autenticación)
router.put('/:idCategory/photo', isAuth, categoryPhotoUpload);

module.exports = router;
