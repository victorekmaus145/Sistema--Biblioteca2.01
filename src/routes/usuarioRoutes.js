const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota de teste
router.get('/teste', (req, res) => {
  res.json({ message: 'Rotas de usuários funcionando!' });
});

// Rotas para usuários
router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.obterUsuario);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.atualizarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);

module.exports = router;
