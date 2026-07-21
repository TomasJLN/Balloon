const express = require('express');

const {
    userNew,
    userValidate,
    userDelete,
    userChangePassword,
    userRecoveryPassword,
    userResetPassword,
    userChangeAvatar,
    userGetProfile,
    userLogin,
    userEdit,
    adminGetUsers,
    adminToggleUser,
} = require('../controllers/users');

const isAuth = require('../middlewares/isAuth');
const userExists = require('../middlewares/userExists');
const userCheckMail = require('../middlewares/userCheckMail');
const {
    demoAccountOnly,
    demoWriteDisabled,
} = require('../middlewares/demoMode');
const {
    loginLimiter,
    registerLimiter,
    registerEmailLimiter,
    recoveryLimiter,
} = require('../middlewares/rateLimiter');

const router = express.Router();

// Crear cuenta activa con protección anti-abuso
router.post('/', demoWriteDisabled, registerLimiter, registerEmailLimiter, userNew);
// Activar cuenta por código
router.get('/validate/:registryCode', demoWriteDisabled, userValidate);
// Iniciar sesión
router.post('/login', demoAccountOnly, loginLimiter, userLogin);
// Recuperar contraseña (envía email)
router.put('/password/recover', demoWriteDisabled, recoveryLimiter, userCheckMail, userRecoveryPassword);
// Resetear contraseña
router.put('/password/reset', demoWriteDisabled, userResetPassword);
// Cambiar contraseña (requiere autenticación)
router.put('/password', demoWriteDisabled, isAuth, userExists, userChangePassword);
// Cambiar avatar
router.put('/avatar', demoWriteDisabled, isAuth, userExists, userChangeAvatar);
// Obtener perfil del usuario autenticado
router.get('/', isAuth, userExists, userGetProfile);
// Editar datos de usuario
router.put('/edit', demoWriteDisabled, isAuth, userExists, userEdit);
// Eliminar cuenta de usuario
router.delete('/', demoWriteDisabled, isAuth, userExists, userDelete);

// Admin: listar todos los usuarios
router.get('/list', isAuth, adminGetUsers);
// Admin: activar / desactivar un usuario
router.put('/toggle/:id', demoWriteDisabled, isAuth, adminToggleUser);

module.exports = router;
