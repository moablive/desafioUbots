# 🚀 Desafio Técnico - Ubots: API de Gerenciamento de Solicitações para FlowPay

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,git,npm,axios" alt="Tecnologias utilizadas: Node.js, Express, Git, npm, Axios" />
</p>

## 📋 Visão Geral

Este projeto é uma **API RESTful** desenvolvida com **Node.js** e **Express.js**, projetada para gerenciar e distribuir solicitações de atendimento de forma inteligente e escalável para a **FlowPay**. A API utiliza a **Inteligência Artificial do Google Gemini** para classificar dinamicamente os assuntos das solicitações, direcionando-as para os times apropriados: **Cartões**, **Empréstimos** ou **Outros Assuntos**. O sistema é robusto, modular e segue boas práticas de desenvolvimento, garantindo manutenibilidade e escalabilidade.

### ✨ Principais Funcionalidades

- **Direcionamento Inteligente**: A IA classifica automaticamente o assunto da solicitação e o roteia para o time correto, eliminando mapeamentos estáticos.
- **Gerenciamento de Capacidade**: Respeita o limite de **3 atendimentos simultâneos** por atendente, otimizando a alocação.
- **Fila de Espera Dinâmica**: Solicitações excedentes são armazenadas em uma fila de espera e processadas automaticamente quando um atendente estiver disponível.
- **Arquitetura Modular**: Separação clara entre lógica de negócio, rotas e dados, seguindo o princípio de **Separação de Responsabilidades**.
- **Configuração Flexível**: Utiliza variáveis de ambiente (`.env`) para gerenciar URLs, chaves de API e configurações de atendentes.
- **Nomenclatura Padronizada**: Códigos numéricos para tipos de solicitação garantem consistência e minimizam erros.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do backend.
- **Express.js**: Framework para construção da API RESTful.
- **Axios**: Cliente HTTP para simulação de requisições no script de mock.
- **Google Gemini API**: Inteligência Artificial para classificação de solicitações.
- **Nodemon**: Ferramenta para desenvolvimento com reinicialização automática do servidor.
- **Git**: Controle de versão.
- **npm**: Gerenciador de pacotes.

---

## 📦 Pré-requisitos

Para executar a aplicação, você precisará de:

- **Node.js**: Versão 18 ou superior.
- **npm**: Gerenciador de pacotes do Node.js.
- **Chave de API do Google Gemini**: Obtenha a sua no [Google AI Studio](https://aistudio.google.com/).
- **Dois terminais**: Um para o servidor e outro para o script de mock.

---

## 🚀 Como Executar a Aplicação

Siga os passos abaixo para configurar e executar a API localmente:

### 1. Configurar o Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione a chave de API do Google Gemini:

```plaintext
GEMINI_API_KEY="SUA_CHAVE_AQUI"
PORT=3000
```

### 2. Instalar Dependências

Navegue até o diretório do projeto (`Backend`) e instale as dependências:

```bash
npm install
```

Isso instalará **Express.js**, **Nodemon**, **Axios** e outras dependências listadas no `package.json`.

### 3. Iniciar o Servidor

No primeiro terminal, inicie o servidor em modo de desenvolvimento com **Nodemon**:

```bash
npm run dev
```

A mensagem `Servidor rodando em http://localhost:3000` será exibida, indicando que a API está ativa. 🎉

### 4. Simular Requisições

No segundo terminal, execute o script de mock para simular requisições de usuários:

```bash
npm run mock
```

O script usa **Axios** para enviar requisições POST com assuntos aleatórios, permitindo testar o sistema de distribuição e a fila de espera.

---

## 🌐 Endpoints da API

A API oferece os seguintes endpoints:

| Método | Endpoint                    | Descrição                                                                 |
|--------|-----------------------------|---------------------------------------------------------------------------|
| `GET`  | `/`                         | Retorna uma mensagem de boas-vindas ("Olá!") para confirmar o servidor.   |
| `POST` | `/api/solicitacoes`         | Recebe uma solicitação com um assunto e a distribui para o time correto.  |

### Exemplo de Requisição POST

Envie uma solicitação para o endpoint `/api/solicitacoes` com o seguinte corpo JSON:

```javascript
const axios = require('axios');

const url = 'http://localhost:3000/api/solicitacoes';
const body = {
  assunto: "Meu cartão não está funcionando"
};

axios.post(url, body)
  .then(response => {
    console.log(`Status: ${response.status}`);
    console.log(`Resposta:`, response.data);
  })
  .catch(error => {
    console.error(`Erro: ${error.response.status}`);
    console.error(`Mensagem:`, error.response.data);
  });
```

---

## 📊 Arquitetura do Sistema

A aplicação segue uma arquitetura modular e organizada. Os componentes principais incluem:

- **mock-requests.js**: Simula requisições de clientes com assuntos aleatórios.
- **utils/random.js**: Fornece funções para gerar dados aleatórios, como intervalos de tempo.
- **utils/data.js**: Armazena dados em memória (`atendentes` e `filaDeEspera`).
- **services/distributionService.js**: Contém a lógica de negócio para classificação e distribuição de solicitações.

O fluxo de interação ocorre da seguinte forma:
1. O cliente (`mock-requests.js`) envia uma requisição POST.
2. O roteador Express recebe a requisição e a encaminha para a lógica de negócio.
3. A IA do Google Gemini é chamada para classificar o assunto.
4. A lógica de negócio (`services/distributionService.js`) manipula os dados em `utils/data.js`.

---

## 🛠️ Melhorias Propostas

Para tornar a API ainda mais robusta e preparada para produção, as seguintes melhorias foram planejadas:

### 1. **Migração para TypeScript**
   - **Objetivo**: Garantir tipagem estática e reduzir erros em tempo de execução.
   - **Benefícios**:
     - Interfaces claras para solicitações, atendentes e filas.
     - Refatorações seguras em projetos complexos.
     - Melhor integração com IDEs e ferramentas de desenvolvimento.

### 2. **Integração com Apache Kafka ** <img src="https://skillicons.dev/icons?i=kafka" alt="Kafka" /> 
   - **Objetivo**: Implementar um sistema de filas assíncrono e escalável.
   - **Benefícios**:
     - Processamento distribuído para grandes volumes de solicitações.
     - Alta disponibilidade e tolerância a falhas.
     - Persistência de mensagens para evitar perdas.

### 3. **Banco de Dados Persistente**
   - **Objetivo**: Substituir o armazenamento em memória por um banco de dados (ex.: MongoDB ou PostgreSQL).
   - **Benefícios**:
     - Persistência de dados entre reinicializações.
     - Suporte a auditoria e relatórios.

### 4. **Autenticação e Autorização**
   - **Objetivo**: Adicionar camadas de segurança com JWT ou OAuth2.
   - **Benefícios**:
     - Controle de acesso a endpoints sensíveis.
     - Proteção contra uso não autorizado.

---

## 📝 Justificativa do Desenvolvimento Atual

O projeto foi implementado em **JavaScript** com **Node.js** para priorizar:

- **Agilidade**: Desenvolvimento rápido para validar a lógica de negócio.
- **Simplicidade**: Uso de tecnologias amplamente conhecidas.
- **Prototipagem**: Iteração inicial funcional, com plano de migração para **TypeScript** e **Kafka** para maior robustez.

---

## 🎉 Como Explorar?

1. Configure o ambiente e instale as dependências.
2. Inicie o servidor com `npm run dev`.
3. Execute o script de mock com `npm run mock`.
4. Teste os endpoints com ferramentas como **Postman** ou o exemplo de **Axios** fornecido.
5. Observe o sistema de distribuição e a fila de espera em ação!

Seja bem-vindo à API de Gerenciamento de Solicitações da FlowPay! 🚀