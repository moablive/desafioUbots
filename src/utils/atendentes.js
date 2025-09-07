// src/utils/atendentes.js

const { REQUEST_TYPES } = require('../interfaces/request_types');

// Busca o número de atendentes do .env e converte para número
const numberOfAttendants = parseInt(process.env.NUMBER_OF_ATTENDANTS) || 100;

// Representação de dados em memória (não persistidos)
const atendentes = [];

for (let i = 1; i <= numberOfAttendants; i++) {
    let team;
    // Distribui os atendentes de forma equilibrada entre os times
    const teamModulo = i % 3;

    if (teamModulo === 1) {
        team = REQUEST_TYPES.CARD_ISSUES;
    } else if (teamModulo === 2) {
        team = REQUEST_TYPES.LOAN_APPLICATION;
    } else {
        team = REQUEST_TYPES.OTHER_ISSUES;
    }

    atendentes.push({
        id: `att-${String(i).padStart(3, '0')}`,
        team: team,
        current_calls: 0
    });
}

module.exports = {
    atendentes
};