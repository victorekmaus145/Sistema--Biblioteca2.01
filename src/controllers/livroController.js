const pool = require('../config/database');

const listarLivros = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM livros ORDER BY id DESC');
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({ error: 'Erro ao listar livros' });
  }
};

const buscarLivroPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ error: 'Erro ao buscar livro' });
  }
};

const cadastrarLivro = async (req, res) => {
  const { titulo, autor, ano_publicacao, isbn } = req.body; // SEM genero e quantidade
  
  if (!titulo || !autor) {
    return res.status(400).json({ error: 'Título e autor são obrigatórios' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO livros (titulo, autor, ano_publicacao, isbn) VALUES (?, ?, ?, ?)',
      [titulo, autor, ano_publicacao || null, isbn || null]
    );
    
    res.status(201).json({ 
      message: 'Livro cadastrado com sucesso', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar livro' });
  }
};

const atualizarLivro = async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano_publicacao, isbn } = req.body; // SEM genero e quantidade
  
  try {
    const [result] = await pool.query(
      `UPDATE livros 
       SET titulo = ?, autor = ?, ano_publicacao = ?, isbn = ?
       WHERE id = ?`,
      [titulo, autor, ano_publicacao || null, isbn || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    res.status(200).json({ message: 'Livro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
};

// FUNÇÃO CORRIGIDA PARA EXCLUIR LIVRO
const excluirLivro = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log(`Tentando excluir livro ID: ${id}`);
    
    // DEBUG: Verificar se conexão está OK
    console.log('Conexão estabelecida:', connection.threadId);
    
    // DEBUG: Tentar buscar empréstimos primeiro
    const [emprestimosExistentes] = await connection.query(
      'SELECT id, livro_id, usuario_id FROM emprestimos WHERE livro_id = ?',
      [id]
    );
    console.log('Empréstimos encontrados para este livro:', emprestimosExistentes);
    console.log('Número de empréstimos:', emprestimosExistentes.length);
    
    // DEBUG: Verificar se o livro existe
    const [livroExistente] = await connection.query(
      'SELECT id, titulo FROM livros WHERE id = ?',
      [id]
    );
    console.log('Livro encontrado:', livroExistente);
    
    // SOLUÇÃO: Desativar verificação de FK temporariamente
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // 1. Primeiro excluir TODOS os empréstimos deste livro
    const [resultEmprestimos] = await connection.query(
      'DELETE FROM emprestimos WHERE livro_id = ?',
      [id]
    );
    
    console.log(`Empréstimos excluídos: ${resultEmprestimos.affectedRows}`);
    
    // 2. Depois excluir o livro
    const [resultLivro] = await connection.query(
      'DELETE FROM livros WHERE id = ?',
      [id]
    );
    
    // Reativar verificação de FK
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    if (resultLivro.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        error: 'Livro não encontrado' 
      });
    }
    
    await connection.commit();
    
    res.status(200).json({ 
      message: 'Livro excluído com sucesso',
      detalhes: {
        livroExcluido: resultLivro.affectedRows,
        emprestimosExcluidos: resultEmprestimos.affectedRows
      }
    });
    
  } catch (error) {
    await connection.rollback();
    
    // Garantir que FK checks sejam reativados mesmo em caso de erro
    try {
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.log('Erro ao reativar FK checks:', e);
    }
    
    console.error('Erro ao excluir livro:', error);
    console.error('Código do erro:', error.code);
    console.error('SQL Message:', error.sqlMessage);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Erro ao excluir livro',
      detalhes: error.message,
      codigo: error.code,
      sqlMessage: error.sqlMessage
    });
  } finally {
    connection.release();
  }
};

// Função para obter livro (apenas outro nome para buscarLivroPorId)
const obterLivro = async (req, res) => {
  return buscarLivroPorId(req, res);
};

// Função para criar livro (apenas outro nome para cadastrarLivro)
const criarLivro = async (req, res) => {
  return cadastrarLivro(req, res);
};

// Função para listar livros disponíveis (CORRIGIDA - sem quantidade)
const listarLivrosDisponiveis = async (req, res) => {
  try {
    // REMOVE a condição WHERE quantidade > 0
    const [result] = await pool.query('SELECT * FROM livros ORDER BY titulo');
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar livros disponíveis:', error);
    res.status(500).json({ error: 'Erro ao listar livros disponíveis' });
  }
};

// Exportar todas as funções (APENAS UMA VEZ!)
module.exports = {
  listarLivros,
  buscarLivroPorId,
  cadastrarLivro,
  atualizarLivro,
  excluirLivro,
  obterLivro,
  criarLivro,
  listarLivrosDisponiveis
};