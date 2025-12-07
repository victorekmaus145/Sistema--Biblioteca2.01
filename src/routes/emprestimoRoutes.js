const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');

// Rotas para Empréstimos
router.post('/', emprestimoController.criarEmprestimo);
router.get('/', emprestimoController.listarEmprestimos);
router.get('/ativos', emprestimoController.listarEmprestimosAtivos);
router.put('/:id/devolver', emprestimoController.finalizarEmprestimo);

module.exports = router;
