'use strict';

const userChangeAvatar = require('./userChangeAvatar');
const userChangePassword = require('./userChangePassword');
const userDelete = require('./userDelete');
const userEdit = require('./userEdit');
const userGetProfile = require('./userGetProfile');
const userLogin = require('./userLogin');
const userNew = require('./userNew');
const userRecoveryPassword = require('./userRecoveryPassword');
const userResetPassword = require('./userResetPassword');
const userValidate = require('./userValidate');

module.exports = {
    userChangeAvatar,
    userChangePassword,
    userDelete,
    userEdit,
    userGetProfile,
    userLogin,
    userNew,
    userRecoveryPassword,
    userResetPassword,
    userValidate,
};
