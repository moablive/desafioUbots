const express = require('express');
const router = express.Router();

const distributionService = require('../services/distributionService');
const { mapSubjectToTeamId } = require('../utils/mapSubject');

// Rota para receber novas solicitações de atendimento via JSON
router.post('/solicitacoes', async (req, res) => {
    const { assunto } = req.body;

    // Loga o início da requisição no roteador
    console.log(`[ROUTER] Nova solicitação recebida para o assunto: "${assunto}"`);

    if (!assunto || typeof assunto !== 'string') {
        // Loga erro de validação
        console.error(`[ROUTER] Erro: Assunto da solicitação inválido.`, req.body);
        return res.status(400).json({
            message: 'O corpo da requisição deve conter o campo "assunto" como uma string.'
        });
    }

    try {
        const teamId = await mapSubjectToTeamId(assunto);
        const result = distributionService.distributeRequest(teamId);
        
        // Loga o resultado final da requisição
        console.log(`[ROUTER] Resposta enviada com status ${result.status} e mensagem: "${result.body.message}"`);
        res.status(result.status).json(result.body);
    } catch (error) {
        // Loga erros internos
        console.error(`[ROUTER] Erro interno ao processar a solicitação:`, error);
        res.status(500).json({
            message: 'Ocorreu um erro interno ao processar a sua solicitação.'
        });
    }
});

module.exports = router;