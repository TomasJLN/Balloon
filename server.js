'use strict';

/** Requirements **/
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const app = express();

const { PORT } = process.env;

/** Middlewares **/
const userExists = require('./middlewares/userExists');
const isAuth = require('./middlewares/isAuth');
const bookingExists = require('./middlewares/bookingExists');
const canVote = require('./middlewares/canVote');
const userCheckMail = require('./middlewares/userCheckMail');
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/** User controllers **/
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
} = require('./controllers/users');

/** Category controllers **/
const {
    categoryNew,
    categoryEdit,
    categoryGet,
    categoryList,
    categoryDelete,
    categoryPhotoUpload,
} = require('./controllers/categories');

/** Experience controllers **/
const {
    experienceNew,
    experiencePhotoUpload,
    experienceDelete,
    experienceEdit,
    experienceGet,
    experienceList,
} = require('./controllers/experiences');

/** Booking controllers **/
const {
    bookingNew,
    bookingCancel,
    bookingList,
    bookingGet,
} = require('./controllers/bookings');

/** ReviewNew **/
const { reviewList, reviewNew } = require('./controllers/reviews');

/** Filter Controller **/
const {
    priceFilter,
    experienceFeatured,
    filter,
    locationFilter,
    allFilters,
    occupiedFilter,
} = require('./filters');

/** Newsletter controllers **/

/** Global controllers **/
app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('static'));

/** User Endpoints **/
app.post('/user', userNew);
app.delete('/user', isAuth, userExists, userDelete);
app.put('/user/password/recover', userCheckMail, userRecoveryPassword);
app.put('/user/password/reset', userResetPassword);
app.post('/user/login', userLogin);
app.put('/user/password', isAuth, userExists, userChangePassword);
app.put('/user/avatar', isAuth, userExists, userChangeAvatar);
app.get('/user', isAuth, userExists, userGetProfile);
app.get('/user/validate/:registryCode', userValidate);
app.put('/user/edit', isAuth, userExists, userEdit);

/** Category Endpoints **/
app.post('/category', isAuth, categoryNew);
app.get('/category', categoryList);
app.put('/category/:idCategory', isAuth, categoryEdit);
app.get('/category/:idCategory', isAuth, categoryGet);
app.delete('/category/:idCategory', isAuth, categoryDelete);
app.put('/category/:idCategory/photo', isAuth, categoryPhotoUpload);

/** Experience Endpoints **/
app.post('/experience', isAuth, experienceNew);
app.get('/experience/list', experienceList);
app.get('/experience/featured', experienceFeatured);
app.put('/experience/:idExperience/photo', isAuth, experiencePhotoUpload);
app.delete('/experience/:idExperience', isAuth, experienceDelete);
app.put('/experience/:idExperience', isAuth, experienceEdit);
app.get('/experience/:idExperience', isAuth, experienceGet);
// app.get('/experience/price/filter', priceFilter);

/** Booking Endpoints **/
app.post('/booking', isAuth, bookingNew);
app.get('/review', reviewList);
app.get('/booking/list', isAuth, bookingList);
app.get('/booking/view/:idBooking', isAuth, bookingGet);
app.get('/booking/view/', isAuth, bookingGet);
app.delete('/booking/:ticketNumber', isAuth, bookingExists, bookingCancel);

/** Review Endpoints **/
app.post('/review/:ticketNumber', isAuth, bookingExists, canVote, reviewNew);

/** Filters Endpoints **/
app.get('/allFilter', allFilters);
app.get('/filters/occupied', occupiedFilter);
app.get('/filters/featured', experienceFeatured);

/** Error Middleware **/
app.use((error, req, res, next) => {
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

/** Not Found Middleware **/
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

/** Listen Port Server **/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
