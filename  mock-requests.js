// mock-requests.js

const axios = require('axios');
require('dotenv').config();

const { getRandomInt } = require('./utils/random');

const API_URL = `${process.env.API_BASE_URL}/api/solicitacoes`;

// FIXO DEVIDO MOCK
// Mudar para frases mais realistas
const requestSubjects = [
    'meu cartão não está funcionando',
    'quero saber sobre as taxas de juros de um empréstimo',
    'como posso cancelar meu cartão?',
    'preciso de ajuda para contratar um empréstimo',
    'uma cobrança indevida apareceu na minha fatura do cartão',
    'minha conta foi bloqueada por engano',
    'gostaria de aumentar o limite do meu cartão',
    'quais os requisitos para um empréstimo pessoal?'
];

async function sendRequest() {
    const randomSubject = requestSubjects[getRandomInt(0, requestSubjects.length - 1)];

    try {
        const response = await axios.post(API_URL, { assunto: randomSubject });
        console.log(`Status da Requisição: ${response.status} para o assunto "${randomSubject}"`);
        console.log('Resposta:', response.data);
    } catch (error) {
        if (error.response) {
            console.error(`Erro na requisição para o assunto "${randomSubject}":`, error.response.status);
            console.error('Mensagem de erro:', error.response.data);
        } else {
            console.error('Erro na requisição:', error.message);
        }
    }
}

function startMocking() {
    const randomInterval = getRandomInt(500, 2000);

    console.log(`Enviando requisição... Próxima requisição em ${randomInterval / 1000} segundos.`);

    sendRequest();
    setTimeout(startMocking, randomInterval);
}

startMocking();