# 🎯 ENEM Study Platform

> Plataforma inteligente de estudos para ENEM e vestibulares — organize seu aprendizado, acompanhe seu desempenho e descubra onde precisa melhorar.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-F7DF1E?style=flat-square)

---

## ✨ Funcionalidades

- 🔐 **Autenticação completa** — cadastro e login com JWT + bcrypt
- 📚 **Matérias e tópicos** — estrutura relacional profissional
- 📝 **Quiz inteligente** — questões com alternativas embaralhadas
- 📊 **Progresso automático** — acertos e erros salvos por tópico
- 🧠 **Diagnóstico** — identifica conteúdos dominados e pontos fracos
- 🎯 **Frontend responsivo** — interface moderna em HTML/CSS/JS puro

---

## 🏗️ Arquitetura

```
enem-study-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # DB e JWT
│   │   ├── controllers/     # Camada HTTP (req/res)
│   │   ├── services/        # Regras de negócio
│   │   ├── repositories/    # Acesso ao banco
│   │   ├── routes/          # Endpoints da API
│   │   ├── middlewares/     # Auth e error handler
│   │   ├── database/        # Migrations e seeds
│   │   ├── app.js           # Configuração Express
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    └── index.html           # SPA em HTML/CSS/JS puro
```

---

## 🗄️ Modelo de Dados

```
users ──< user_answers >── answers ──< questions ──< topics ──< subjects
users ──< progress >────────────────────────────── topics
```

| Tabela | Descrição |
|---|---|
| `users` | Contas de usuário |
| `subjects` | Matérias (Matemática, Física...) |
| `topics` | Tópicos por matéria |
| `questions` | Questões com dificuldade |
| `answers` | Alternativas (1 correta por questão) |
| `user_answers` | Histórico de respostas |
| `progress` | Acertos/erros por tópico por usuário |

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/enem-study-platform.git
cd enem-study-platform/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais do MySQL
```

### 4. Crie o banco de dados

No MySQL, execute os arquivos na ordem:

```bash
mysql -u root -p < src/database/migrations/001_schema.sql
mysql -u root -p < src/database/migrations/002_seed.sql
```

### 5. Inicie o servidor

```bash
npm run dev        # Desenvolvimento (nodemon)
npm start          # Produção
```

O servidor estará em: `http://localhost:3333`

### 6. Abra o frontend

Abra `frontend/index.html` no navegador (ou use Live Server no VS Code).

---

## 📡 Endpoints da API

### Auth

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/register` | Criar conta | ❌ |
| POST | `/api/login` | Login e retorna JWT | ❌ |
| GET | `/api/me` | Dados do usuário logado | ✅ |

### Matérias e Tópicos

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/subjects` | Listar matérias | ✅ |
| GET | `/api/subjects/:id/topics` | Tópicos de uma matéria | ✅ |
| GET | `/api/topics/:id/questions` | Questões de um tópico | ✅ |

### Quiz e Progresso

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/answers` | Enviar resposta | ✅ |
| GET | `/api/progress` | Ver desempenho | ✅ |

### Exemplo de request

**POST /api/login**
```json
{
  "email": "aluno@email.com",
  "password": "123456"
}
```

**Response:**
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

---

## 🧪 Testando com Postman

1. Importe as variáveis de ambiente:
   - `base_url`: `http://localhost:3333/api`
   - `token`: (preencher após login)

2. Fluxo de teste:
   - `POST /register` → criar conta
   - `POST /login` → copiar token
   - `GET /subjects` → listar matérias
   - `GET /subjects/1/topics` → tópicos de Matemática
   - `GET /topics/2/questions` → questões de Função do 2º Grau
   - `POST /answers` → enviar resposta
   - `GET /progress` → ver desempenho

---

## 📈 Lógica de Progresso

| Taxa de acerto | Status | Mensagem |
|---|---|---|
| ≥ 80% | ✅ Dominado | "Você domina este conteúdo!" |
| 50–79% | 🔄 Em progresso | "Continue praticando" |
| < 50% | ⚠️ Reforçar | "Precisa reforçar este assunto" |

---

## 🛠️ Stack

**Backend:** Node.js · Express.js · MySQL2 · JWT · Bcrypt · Dotenv · CORS  
**Frontend:** HTML5 · CSS3 (Custom Properties) · JavaScript puro (Fetch API)  
**Ferramentas:** Postman · Git · VS Code · Nodemon

---

## 📁 Padrão de Código

A API segue o padrão em **camadas**:

```
Request → Route → Controller → Service → Repository → Database
                     ↑
                Middleware (Auth)
```

- **Controller:** apenas req/res
- **Service:** regras de negócio
- **Repository:** SQL queries
- **Middleware:** JWT e validações globais

---

## 🚧 Próximas features (Roadmap)

- [ ] Reforço automático de questões erradas
- [ ] Gamificação com pontos e níveis
- [ ] Dashboard com gráficos de evolução
- [ ] Modo revisão por tema
- [ ] Timer de simulado ENEM
- [ ] Upload de questões via CSV

---

## 👨‍💻 Autor

Feito com 💙 para quem quer passar no ENEM.

---

> *"Estude com inteligência, não só com esforço."*
