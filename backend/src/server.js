require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  await testConnection();

  app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║      🎯 ENEM Study Platform API           ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║  🚀 Servidor rodando na porta: ${PORT}        ║`);
    console.log(`║  🌍 http://localhost:${PORT}                  ║`);
    console.log(`║  📋 Ambiente: ${process.env.NODE_ENV || 'development'}               ║`);
    console.log('╚═══════════════════════════════════════════╝');
    console.log('');
  });
}

bootstrap();
