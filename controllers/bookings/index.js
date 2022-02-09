'use strict';

const bookingNew = require('./bookingNew');
const bookingCancel = require('./bookingCancel');
const bookingList = require('./bookingList');
const bookingGet = require('./bookingGet');
const bookingGetQR = require('./bookingGetQR');

module.exports = {
    bookingNew,
    bookingCancel,
    bookingList,
    bookingGet,
    bookingGetQR,
};
