const express = require('express');
require('dotenv').config();

// Importar rotas
const livroRoutes = require('./routes/livroRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: '📚 API da Biblioteca funcionando!',
    version: '1.0.0',
    endpoints: {
      // Livros
      listar_livros: 'GET /api/livros',
      livros_disponiveis: 'GET /api/livros/disponiveis',
      criar_livro: 'POST /api/livros',
      buscar_livro: 'GET /api/livros/{id}',
      
      // Usuários
      listar_usuarios: 'GET /api/usuarios',
      criar_usuario: 'POST /api/usuarios',
      buscar_usuario: 'GET /api/usuarios/{id}',
      
      // Empréstimos
      listar_emprestimos: 'GET /api/emprestimos',
      emprestimos_ativos: 'GET /api/emprestimos/ativos',
      criar_emprestimo: 'POST /api/emprestimos',
      devolver_livro: 'PUT /api/emprestimos/{id}/devolver'
    }
  });
});

// Usar rotas
app.use('/api/livros', livroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/emprestimos', emprestimoRoutes);

// Rota para 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Acesse: http://localhost:${PORT}`);
  console.log('\n📖 Endpoints disponíveis:');
  console.log('\n  LIVROS:');
  console.log('    GET  /api/livros');
  console.log('    GET  /api/livros/disponiveis');
  console.log('    POST /api/livros');
  console.log('\n  USUÁRIOS:');
  console.log('    GET  /api/usuarios');
  console.log('    POST /api/usuarios');
  console.log('\n  EMPRÉSTIMOS:');
  console.log('    GET  /api/emprestimos');
  console.log('    GET  /api/emprestimos/ativos');
  console.log('    POST /api/emprestimos');
});
