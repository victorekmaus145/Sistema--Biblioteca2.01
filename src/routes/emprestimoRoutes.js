const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

// Rota de teste
router.get('/teste', (req, res) => {
  res.json({ message: 'Rotas de empréstimos funcionando!' });
});

// Rotas para empréstimos
router.get('/', emprestimoController.listarEmprestimos);
router.get('/ativos', emprestimoController.listarEmprestimosAtivos);
router.get('/usuario/:usuario_id', emprestimoController.listarEmprestimosPorUsuario);
router.get('/:id', emprestimoController.obterEmprestimo);
router.post('/', emprestimoController.criarEmprestimo);
router.put('/:id/devolver', emprestimoController.devolverLivro);

module.exports = router;
