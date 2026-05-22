<div align="center">

<img src="https://img.shields.io/badge/STATUS-Em%20desenvolvimento-blue?style=for-the-badge" />

# 🎯 Smart Study Platform

**Plataforma inteligente de estudos para ENEM e vestibulares**

Organize seu aprendizado, acompanhe seu desempenho por matéria e descubra exatamente onde precisa melhorar.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-F7DF1E?style=flat-square&logo=jsonwebtokens&logoColor=black)](https://jwt.io)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

</div>

---

## 📋 Sobre o projeto

O **Smart Study Platform** é uma aplicação fullstack desenvolvida para ajudar estudantes a se prepararem para o ENEM e vestibulares de forma inteligente. O sistema vai além de um simples banco de questões — ele acompanha o desempenho do usuário por conteúdo e identifica automaticamente quais assuntos ele domina e quais precisa reforçar.

### O problema que resolve

Muitos estudantes estudam sem saber onde estão errando mais. Essa plataforma resolve isso salvando cada resposta, calculando a taxa de acerto por tópico e classificando o desempenho em tempo real.

---

## ✨ Funcionalidades

- 🔐 **Autenticação segura** — cadastro e login com JWT + bcrypt
- 📚 **Matérias e tópicos** — estrutura relacional (Matemática, Física, Português e mais)
- 📝 **Quiz interativo** — questões com alternativas embaralhadas a cada sessão
- ✅ **Feedback imediato** — acerto/erro com explicação da questão
- 📊 **Progresso automático** — desempenho salvo por tópico a cada resposta
- 🧠 **Diagnóstico inteligente** — classifica conteúdos em "Dominado", "Em progresso" ou "Reforçar"
- 📈 **Dashboard pessoal** — visão geral de acertos, erros e taxa de acerto global

---

## 🖥️ Demonstração

> Interface dark mode, responsiva, construída em HTML/CSS/JS puro sem frameworks.

| Tela de Login | Dashboard | Quiz | Progresso |
|---|---|---|---|
| Autenticação com JWT | Matérias e estatísticas | Questões com feedback | Desempenho por tópico |

---

## 🏗️ Arquitetura

```
smart-study-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Pool de conexões MySQL
│   │   │   └── jwt.js           # Configuração do token
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── subjectController.js
│   │   │   ├── questionController.js
│   │   │   └── progressController.js
│   │   ├── services/
│   │   │   ├── authService.js   # Regras de negócio de auth
│   │   │   └── progressService.js # Lógica de progresso e diagnóstico
│   │   ├── repositories/
│   │   │   ├── userRepository.js
│   │   │   ├── subjectRepository.js
│   │   │   ├── questionRepository.js
│   │   │   └── progressRepository.js
│   │   ├── middlewares/
│   │   │   ├── auth.js          # Verificação JWT
│   │   │   └── errorHandler.js  # Tratamento global de erros
│   │   ├── routes/
│   │   │   └── index.js         # Todos os endpoints
│   │   ├── database/
│   │   │   └── migrations/
│   │   │       ├── 001_schema.sql  # Criação das tabelas
│   │   │       └── 002_seed.sql    # Dados iniciais
│   │   ├── app.js               # Configuração Express + middlewares
│   │   └── server.js            # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    └── index.html               # SPA completa (HTML + CSS + JS)
```

### Padrão de camadas

```
Request → Route → Controller → Service → Repository → MySQL
                      ↑
                 Middleware (Auth JWT)
```

- **Controller** — recebe e responde a requisição HTTP
- **Service** — contém as regras de negócio
- **Repository** — responsável pelas queries SQL
- **Middleware** — validação do token antes de rotas protegidas

---

## 🗄️ Banco de Dados

```
subjects ──< topics ──< questions ──< answers
                              ↓
                        user_answers >── users
                              ↓
                          progress
```

| Tabela | Descrição |
|---|---|
| `users` | Contas dos estudantes |
| `subjects` | Matérias (Matemática, Física, Português...) |
| `topics` | Tópicos de cada matéria |
| `questions` | Questões com nível de dificuldade |
| `answers` | Alternativas (1 correta por questão) |
| `user_answers` | Histórico completo de respostas |
| `progress` | Contagem de acertos/erros por tópico por usuário |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com)

### 1. Clone o repositório

```bash
git clone https://github.com/GustaDev9/smart-study-platform.git
cd smart-study-platform/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
PORT=3333
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=enem_study_platform

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
```

### 4. Crie o banco de dados

No terminal MySQL ou Workbench, execute os arquivos nessa ordem:

```bash
mysql -u root -p < src/database/migrations/001_schema.sql
mysql -u root -p < src/database/migrations/002_seed.sql
```

### 5. Inicie o servidor

```bash
npm run dev     # Desenvolvimento com nodemon
npm start       # Produção
```

Acesse: `http://localhost:3333/health`

### 6. Abra o frontend

Abra `frontend/index.html` com o **Live Server** do VS Code ou direto no navegador.

---

## 📡 Endpoints da API

### 🔓 Públicos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/register` | Criar conta |
| `POST` | `/api/login` | Login — retorna JWT |
| `GET` | `/health` | Health check da API |

### 🔒 Autenticados (Bearer Token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/me` | Dados do usuário logado |
| `GET` | `/api/subjects` | Listar matérias |
| `GET` | `/api/subjects/:id/topics` | Tópicos de uma matéria |
| `GET` | `/api/topics/:id/questions` | Questões de um tópico |
| `POST` | `/api/answers` | Enviar resposta |
| `GET` | `/api/progress` | Ver desempenho por tópico |

### Exemplo de uso

**POST `/api/login`**
```json
{
  "email": "aluno@email.com",
  "password": "123456"
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "user": { "id": 1, "name": "João Silva", "email": "aluno@email.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST `/api/answers`**
```json
{
  "question_id": 1,
  "answer_id": 3
}
```

**Response `200`**
```json
{
  "success": true,
  "message": "✅ Resposta correta!",
  "data": {
    "is_correct": true,
    "correct_answer_id": 3,
    "explanation": "Usando a fórmula de Bhaskara: x=2 e x=3"
  }
}
```

---

## 📈 Lógica de Progresso

A cada resposta enviada, o sistema atualiza automaticamente a tabela `progress` e classifica o desempenho:

| Taxa de acerto | Status | Classificação |
|---|---|---|
| ≥ 80% | ✅ **Dominado** | Você domina este conteúdo |
| 50% – 79% | 🔄 **Em progresso** | Continue praticando |
| < 50% | ⚠️ **Reforçar** | Precisa reforçar este assunto |

---

## 🧪 Testando com Postman

1. Crie uma variável de ambiente `base_url = http://localhost:3333/api`
2. Faça `POST /register` para criar uma conta
3. Faça `POST /login` e copie o `token` da resposta
4. Em todas as rotas protegidas, adicione o header:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

---

## 🛠️ Stack completa

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Banco de dados | MySQL 8 + mysql2 |
| Autenticação | JSON Web Token (JWT) |
| Hash de senha | bcryptjs |
| Ambiente | dotenv |
| CORS | cors |
| Dev server | nodemon |
| Frontend | HTML5 + CSS3 + JavaScript puro |

---

## 🚧 Roadmap

- [x] Autenticação JWT
- [x] CRUD de matérias e tópicos
- [x] Sistema de quiz com feedback
- [x] Progresso automático por tópico
- [x] Diagnóstico de desempenho
- [ ] Reforço automático de questões erradas
- [ ] Gamificação com pontos e níveis
- [ ] Gráficos de evolução por período
- [ ] Modo simulado com timer
- [ ] Upload de questões via CSV

---

## 👨‍💻 Autor

Desenvolvido por **Gustavo Samuel dos Santos**

[![GitHub](https://img.shields.io/badge/GitHub-GustaDev9-181717?style=flat-square&logo=github)](https://github.com/GustaDev9)

---

<div align="center">

Feito com 💙 para quem quer passar no ENEM.

*"Estude com inteligência, não só com esforço."*

</div>
