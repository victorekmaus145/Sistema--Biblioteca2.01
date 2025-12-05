const usuarioModel = require('../models/usuarioModel');

const usuarioController = {
  // Listar todos os usuários
  async listarUsuarios(req, res) {
    try {
      console.log('Buscando todos os usuários...');
      const usuarios = await usuarioModel.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar usuários',
        details: error.message 
      });
    }
  },

  // Obter usuário por ID
  async obterUsuario(req, res) {
    try {
      const { id } = req.params;
      console.log(`Buscando usuário ID: ${id}`);
      
      const usuario = await usuarioModel.findById(id);
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar usuário',
        details: error.message 
      });
    }
  },

  // Criar novo usuário
  async criarUsuario(req, res) {
    try {
      const { nome, email, telefone } = req.body;
      console.log('Criando novo usuário:', { nome, email });
      
      // Validação
      if (!nome || !email) {
        return res.status(400).json({ 
          error: 'Nome e email são obrigatórios' 
        });
      }
      
      // Verificar se email já existe
      const usuarioExistente = await usuarioModel.findByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ 
          error: 'Email já cadastrado' 
        });
      }
      
      const novoUsuario = await usuarioModel.create({
        nome,
        email,
        telefone: telefone || null
      });
      
      console.log('Usuário criado com ID:', novoUsuario.id);
      res.status(201).json(novoUsuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ 
        error: 'Erro ao criar usuário',
        details: error.message 
      });
    }
  },

  // Atualizar usuário
  async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone } = req.body;
      console.log(`Atualizando usuário ID: ${id}`);
      
      // Verificar se usuário existe
      const usuarioExistente = await usuarioModel.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Se tentar alterar email, verificar se não existe outro com mesmo email
      if (email && email !== usuarioExistente.email) {
        const usuarioComEmail = await usuarioModel.findByEmail(email);
        if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
          return res.status(400).json({ 
            error: 'Email já está em uso por outro usuário' 
          });
        }
      }
      
      const atualizado = await usuarioModel.update(id, {
        nome: nome || usuarioExistente.nome,
        email: email || usuarioExistente.email,
        telefone: telefone !== undefined ? telefone : usuarioExistente.telefone
      });
      
      if (atualizado) {
        const usuarioAtualizado = await usuarioModel.findById(id);
        res.json(usuarioAtualizado);
      } else {
        res.status(400).json({ error: 'Erro ao atualizar usuário' });
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ 
        error: 'Erro ao atualizar usuário',
        details: error.message 
      });
    }
  },

  // Excluir usuário
  async excluirUsuario(req, res) {
    try {
      const { id } = req.params;
      console.log(`Excluindo usuário ID: ${id}`);
      
      // Verificar se usuário existe
      const usuarioExistente = await usuarioModel.findById(id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      const excluido = await usuarioModel.delete(id);
      
      if (excluido) {
        res.status(204).send();
      } else {
        res.status(400).json({ error: 'Erro ao excluir usuário' });
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ 
        error: 'Erro ao excluir usuário',
        details: error.message 
      });
    }
  }
};

module.exports = usuarioController;
