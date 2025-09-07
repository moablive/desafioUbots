const { TEAM_MAP } = require('../interfaces/team_map');
const { atendentes, filaDeEspera } = require('../utils/data');
const { getRandomCallDuration } = require('../utils/random');

function distributeRequest(targetTeamId) {
    const targetTeamName = TEAM_MAP[targetTeamId];

    if (!targetTeamName) {
        console.log(`[SERVICE] Falha: Tipo de solicitação inválido (${targetTeamId})`);
        return {
            status: 400,
            body: { message: 'Tipo de solicitação inválido.' }
        };
    }
    
    // Contar atendentes disponíveis e totais para o time
    const totalAttendantsForTeam = atendentes.filter(att => att.team === targetTeamId).length;
    const busyAttendants = atendentes.filter(att => att.team === targetTeamId && att.current_calls === 3).length;
    const availableAttendants = totalAttendantsForTeam - busyAttendants;

    const availableAttendant = atendentes.find(
        attendant => attendant.team === targetTeamId && attendant.current_calls < 3
    );

    if (availableAttendant) {
        availableAttendant.current_calls++;
        console.log(`[SERVICE] INÍCIO DO ATENDIMENTO! Tipo: '${targetTeamName}' -> Atendente: ${availableAttendant.id} (${availableAttendant.current_calls}/3 chamadas). Atendentes disponíveis no time: ${availableAttendants - 1}`);

        setTimeout(() => {
            availableAttendant.current_calls--;
            console.log(`[SERVICE] FIM DO ATENDIMENTO! Atendente ${availableAttendant.id} liberado. Chamadas atuais: ${availableAttendant.current_calls}.`);
            
            if (filaDeEspera[targetTeamId] && filaDeEspera[targetTeamId].length > 0) {
                console.log(`[SERVICE] Fila do time '${targetTeamName}' tem ${filaDeEspera[targetTeamId].length} solicitações pendentes. Distribuindo a próxima solicitação...`)
                const nextRequest = filaDeEspera[targetTeamId].shift();
                distributeRequest(nextRequest);
            }
        }, getRandomCallDuration());

        return {
            status: 200,
            body: { 
                message: 'Solicitação distribuída com sucesso', 
                assigned_to: availableAttendant.id,
                team: targetTeamName 
            }
        };
    } else {
        filaDeEspera[targetTeamId] = filaDeEspera[targetTeamId] || [];
        filaDeEspera[targetTeamId].push(targetTeamId);
        
        console.log(`[SERVICE] FILA CHEIA! Time '${targetTeamName}' está cheio (${busyAttendants}/${totalAttendantsForTeam} ocupados). Adicionando à fila. Fila atual: ${filaDeEspera[targetTeamId].length}`);
        return {
            status: 202,
            body: { 
                message: 'Todos os atendentes estão ocupados. Sua solicitação foi adicionada à fila de espera.',
                team: targetTeamName 
            }
        };
    }
}

module.exports = {
    distributeRequest
};