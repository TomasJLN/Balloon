'use strict';

const bookingNew = require('./bookingNew');
const bookingCancel = require('./bookingCancel');
const bookingList = require('./bookingList');
const bookingGet = require('./bookingGet');

module.exports = { bookingNew, bookingCancel, bookingList, bookingGet };
