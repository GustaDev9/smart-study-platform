const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 ENEM Study Platform API está online!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ROTAS DA API
// ============================================
app.use('/api', routes);

// ============================================
// 404 - ROTA NÃO ENCONTRADA
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.url} não encontrada`,
  });
});

// ============================================
// ERROR HANDLER GLOBAL
// ============================================
app.use(errorHandler);

module.exports = app;
