// Função para gerar um número aleatório dentro de um intervalo
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar uma duração de chamada aleatória (entre 10 e 60 segundos)
function getRandomCallDuration() {
    return getRandomInt(10000, 60000);
}

module.exports = {
    getRandomInt,
    getRandomCallDuration
};
