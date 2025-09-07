// src/utils/filaDeEspera.js

const { REQUEST_TYPES } = require('../interfaces/request_types');

const filaDeEspera = {
    [REQUEST_TYPES.CARD_ISSUES]: [],
    [REQUEST_TYPES.LOAN_APPLICATION]: [],
    [REQUEST_TYPES.OTHER_ISSUES]: []
};

module.exports = {
    filaDeEspera
};