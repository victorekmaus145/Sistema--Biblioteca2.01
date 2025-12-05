const emprestimoModel = require('../models/emprestimoModel');
const livroModel = require('../models/livroModel');
const usuarioModel = require('../models/usuarioModel');

const emprestimoController = {
  // Listar todos os empréstimos
  async listarEmprestimos(req, res) {
    try {
      console.log('Buscando todos os empréstimos...');
      const emprestimos = await emprestimoModel.findAll();
      res.json(emprestimos);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar empréstimos',
        details: error.message 
      });
    }
  },

  // Obter empréstimo por ID
  async obterEmprestimo(req, res) {
    try {
      const { id } = req.params;
      console.log(`Buscando empréstimo ID: ${id}`);
      
      const emprestimo = await emprestimoModel.findById(id);
      
      if (!emprestimo) {
        return res.status(404).json({ error: 'Empréstimo não encontrado' });
      }
      
      res.json(emprestimo);
    } catch (error) {
      console.error('Erro ao buscar empréstimo:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar empréstimo',
        details: error.message 
      });
    }
  },

  // Criar novo empréstimo
  async criarEmprestimo(req, res) {
    try {
      const { usuario_id, livro_id } = req.body;
      console.log('Criando novo empréstimo:', { usuario_id, livro_id });
      
      // Validação
      if (!usuario_id || !livro_id) {
        return res.status(400).json({ 
          error: 'Usuário ID e Livro ID são obrigatórios' 
        });
      }
      
      // Verificar se usuário existe
      const usuario = await usuarioModel.findById(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar se livro existe
      const livro = await livroModel.findById(livro_id);
      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      // Verificar se livro está disponível
      if (!livro.disponivel) {
        return res.status(400).json({ 
          error: 'Livro não está disponível para empréstimo' 
        });
      }
      
      // Verificar se usuário já tem este livro emprestado
      const jaEmprestado = await emprestimoModel.verificarEmprestimoAtivo(usuario_id, livro_id);
      if (jaEmprestado) {
        return res.status(400).json({ 
          error: 'Usuário já tem este livro emprestado' 
        });
      }
      
      const novoEmprestimo = await emprestimoModel.create({
        usuario_id,
        livro_id
      });
      
      console.log('Empréstimo criado com ID:', novoEmprestimo.id);
      res.status(201).json(novoEmprestimo);
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error);
      res.status(500).json({ 
        error: 'Erro ao criar empréstimo',
        details: error.message 
      });
    }
  },

  // Devolver livro
  async devolverLivro(req, res) {
    try {
      const { id } = req.params;
      console.log(`Devolvendo empréstimo ID: ${id}`);
      
      // Verificar se empréstimo existe
      const emprestimo = await emprestimoModel.findById(id);
      if (!emprestimo) {
        return res.status(404).json({ error: 'Empréstimo não encontrado' });
      }
      
      // Verificar se já foi devolvido
      if (emprestimo.data_devolvida) {
        return res.status(400).json({ 
          error: 'Este livro já foi devolvido' 
        });
      }
      
      const devolvido = await emprestimoModel.devolver(id);
      
      if (devolvido) {
        res.json({ 
          message: 'Livro devolvido com sucesso',
          emprestimo_id: id 
        });
      } else {
        res.status(400).json({ error: 'Erro ao devolver livro' });
      }
    } catch (error) {
      console.error('Erro ao devolver livro:', error);
      res.status(500).json({ 
        error: 'Erro ao devolver livro',
        details: error.message 
      });
    }
  },

  // Listar empréstimos ativos
  async listarEmprestimosAtivos(req, res) {
    try {
      console.log('Buscando empréstimos ativos...');
      const emprestimos = await emprestimoModel.findAtivos();
      res.json(emprestimos);
    } catch (error) {
      console.error('Erro ao buscar empréstimos ativos:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar empréstimos ativos',
        details: error.message 
      });
    }
  },

  // Listar empréstimos por usuário
  async listarEmprestimosPorUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      console.log(`Buscando empréstimos do usuário ID: ${usuario_id}`);
      
      // Verificar se usuário existe
      const usuario = await usuarioModel.findById(usuario_id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      const emprestimos = await emprestimoModel.findByUsuario(usuario_id);
      res.json({
        usuario,
        emprestimos
      });
    } catch (error) {
      console.error('Erro ao buscar empréstimos por usuário:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar empréstimos por usuário',
        details: error.message 
      });
    }
  }
};

module.exports = emprestimoController;
