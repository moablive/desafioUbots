// src/utils/mapSubject.js

const axios = require('axios');
const { REQUEST_TYPES } = require('../interfaces/request_types');

// Categoria para mapear as respostas do modelo
const CATEGORIES = {
    'Cartões': REQUEST_TYPES.CARD_ISSUES,
    'Empréstimos': REQUEST_TYPES.LOAN_APPLICATION,
    'Outros Assuntos': REQUEST_TYPES.OTHER_ISSUES,
};

// Chave de API, obtida do .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Função de espera para lidar com o limite de taxa da API
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para chamar o modelo de IA e obter a categoria do assunto
async function getSubjectCategory(subject) {

    // Limite de taxa do Gemini 
    await delay(1000); 

    console.log(`[IA] Classificando o assunto "${subject}"...`);

    const prompt = `Classifique a seguinte solicitação do cliente em uma das três categorias: 'Cartões', 'Empréstimos' ou 'Outros Assuntos'. A resposta deve ser apenas o nome da categoria.
    Solicitação: "${subject}"
    `;

    try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: prompt }] }],
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const category = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (CATEGORIES[category]) {
            console.log(`[IA] Assunto classificado como: '${category}'.`);
            return CATEGORIES[category];
        } else {
            console.warn(`[IA] A categoria '${category}' não foi reconhecida pela IA. Usando a categoria padrão.`);
            return REQUEST_TYPES.OTHER_ISSUES;
        }

    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('[IA] Erro 429: Limite de requisições excedido. Atrasando a próxima chamada...');
        } else {
            console.error('[IA] Erro ao chamar a API do Gemini:', error);
        }
        return REQUEST_TYPES.OTHER_ISSUES; 
    }
}

// Mapeia o assunto da solicitação para o ID do time
async function mapSubjectToTeamId(assunto) {
    return await getSubjectCategory(assunto);
}

module.exports = {
    mapSubjectToTeamId
};