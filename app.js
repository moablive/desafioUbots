// Backend/app.js

const express = require('express');
const app = express();
const port = 3000;

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Middleware para processar JSON
app.use(express.json());

// HTML e botão de teste
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: #4CAF50;">Olá! O servidor está funcionando.</h1>
            <p style="font-size: 1.2em; color: #555;">Clique em **Iniciar Teste** para simular o tráfego de usuários. As requisições serão enviadas para a API.</p>
            <p style="font-size: 1em; color: #777;">
                **Observação:** Para ver os detalhes completos da distribuição, como a atribuição de atendentes e o gerenciamento da fila, observe o **console do servidor**.
            </p>
            <button id="startTest" style="background-color: #4CAF50; color: white; border: none; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 8px;">
                Iniciar Teste
            </button>
            <button id="stopTest" style="background-color: #f44336; color: white; border: none; padding: 15px 32px; text-align: center; text-decoration: none; display: none; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 8px;">
            Parar Teste
            </button>
            <div id="log" style="margin-top: 20px; text-align: left; padding: 10px; background-color: #f0f0f0; border-radius: 5px; max-width: 600px; margin-left: auto; margin-right: auto; height: 300px; overflow-y: scroll;">
                <strong>Log de requisições:</strong><br>
            </div>
        </div>

        <script>
            let intervalId;
            const logDiv = document.getElementById('log');
            const startBtn = document.getElementById('startTest');
            const stopBtn = document.getElementById('stopTest');
            const requestSubjects = ['Problemas com cartão', 'contratação de empréstimo', 'Outros assuntos aleatórios'];

            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function logMessage(message, type = 'info') {
                const p = document.createElement('p');
                p.style.borderLeft = '5px solid';
                p.style.paddingLeft = '10px';
                p.style.marginBottom = '5px';
                p.style.borderRadius = '3px';

                if (type === 'success') {
                    p.style.borderColor = '#4CAF50';
                    p.style.backgroundColor = '#e8f5e9';
                } else if (type === 'pending') {
                    p.style.borderColor = '#ff9800';
                    p.style.backgroundColor = '#fff3e0';
                } else if (type === 'error') {
                    p.style.borderColor = '#f44336';
                    p.style.backgroundColor = '#ffebee';
                } else {
                    p.style.borderColor = '#2196f3';
                    p.style.backgroundColor = '#e3f2fd';
                }

                p.innerHTML = message;
                logDiv.appendChild(p);
                logDiv.scrollTop = logDiv.scrollHeight;
            }

            async function sendRequest() {
                const randomSubject = requestSubjects[getRandomInt(0, requestSubjects.length - 1)];
                const baseUrl = window.location.origin + '/api/solicitacoes';
                const body = JSON.stringify({ assunto: randomSubject });

                try {
                    const response = await fetch(baseUrl, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: body
                    });
                    const data = await response.json();
                    
                    if (response.status === 200) {
                        logMessage(\`<strong>Status:</strong> \${response.status} | <strong>Assunto:</strong> \${randomSubject} | <strong>Resposta:</strong> \${data.message}\`, 'success');
                    } else if (response.status === 202) {
                        logMessage(\`<strong>Status:</strong> \${response.status} | <strong>Assunto:</strong> \${randomSubject} | <strong>Resposta:</strong> \${data.message}\`, 'pending');
                    } else {
                        logMessage(\`<strong>Status:</strong> \${response.status} | <strong>Assunto:</strong> \${randomSubject} | <strong>Resposta:</strong> \${data.message}\`, 'error');
                    }

                } catch (error) {
                    logMessage(\`<span style="color: red;"><strong>Erro:</strong> \${error.message}</span>\`, 'error');
                }
            }

            function startMocking() {
                startBtn.style.display = 'none';
                stopBtn.style.display = 'inline-block';
                logMessage("Iniciando o teste... Requisições serão enviadas automaticamente.", 'info');
                
                sendRequest();
                intervalId = setInterval(() => {
                    sendRequest();
                }, getRandomInt(100, 500));
            }

            function stopMocking() {
                clearInterval(intervalId);
                startBtn.style.display = 'inline-block';
                stopBtn.style.display = 'none';
                logMessage("Teste parado.", 'info');
            }

            startBtn.addEventListener('click', startMocking);
            stopBtn.addEventListener('click', stopMocking);
        </script>
    `);
});

// Importa o roteador principal
const mainRouter = require('./src/routes/mainRouter');

// Usa o roteador principal para todas as rotas que começam com '/api'
app.use('/api', mainRouter);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});