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
const verifyTurnstile = require('../middlewares/verifyTurnstile');
const {
    loginLimiter,
    registerLimiter,
    registerEmailLimiter,
    recoveryLimiter,
} = require('../middlewares/rateLimiter');

const router = express.Router();

// Crear cuenta activa con protección anti-abuso
router.post('/', registerLimiter, registerEmailLimiter, verifyTurnstile, userNew);
// Activar cuenta por código
router.get('/validate/:registryCode', userValidate);
// Iniciar sesión
router.post('/login', loginLimiter, userLogin);
// Recuperar contraseña (envía email)
router.put('/password/recover', recoveryLimiter, userCheckMail, userRecoveryPassword);
// Resetear contraseña
router.put('/password/reset', userResetPassword);
// Cambiar contraseña (requiere autenticación)
router.put('/password', isAuth, userExists, userChangePassword);
// Cambiar avatar
router.put('/avatar', isAuth, userExists, userChangeAvatar);
// Obtener perfil del usuario autenticado
router.get('/', isAuth, userExists, userGetProfile);
// Editar datos de usuario
router.put('/edit', isAuth, userExists, userEdit);
// Eliminar cuenta de usuario
router.delete('/', isAuth, userExists, userDelete);

// Admin: listar todos los usuarios
router.get('/list', isAuth, adminGetUsers);
// Admin: activar / desactivar un usuario
router.put('/toggle/:id', isAuth, adminToggleUser);

module.exports = router;
