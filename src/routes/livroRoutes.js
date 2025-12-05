const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

// Rota de teste para verificar se as rotas estão funcionando
router.get('/teste', (req, res) => {
  res.json({ message: 'Rotas de livros funcionando!' });
});

// Rotas para livros - Use os nomes CORRETOS
router.get('/', livroController.listarLivros); // OK
router.get('/disponiveis', livroController.listarLivrosDisponiveis); // OK (agora corrigida)
router.get('/:id', livroController.buscarLivroPorId); // OU livroController.obterLivro
router.post('/', livroController.cadastrarLivro); // OU livroController.criarLivro  
router.put('/:id', livroController.atualizarLivro); // OK
router.delete('/:id', livroController.excluirLivro); // OK

module.exports = router;