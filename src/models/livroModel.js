const pool = require('../config/database');

const livroModel = {
  // Buscar todos os livros
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM livros ORDER BY titulo');
      return rows;
    } catch (error) {
      console.error('Erro no model findAll:', error);
      throw error;
    }
  },

  // Buscar livro por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro no model findById:', error);
      throw error;
    }
  },

  // Criar novo livro
  async create(livro) {
    try {
      const { titulo, autor, ano_publicacao, isbn } = livro;
      const [result] = await pool.query(
        'INSERT INTO livros (titulo, autor, ano_publicacao, isbn) VALUES (?, ?, ?, ?)',
        [titulo, autor, ano_publicacao, isbn]
      );
      return { id: result.insertId, ...livro };
    } catch (error) {
      console.error('Erro no model create:', error);
      throw error;
    }
  },

  // Atualizar livro
  async update(id, livro) {
    try {
      const { titulo, autor, ano_publicacao, isbn, disponivel } = livro;
      const [result] = await pool.query(
        'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, isbn = ?, disponivel = ? WHERE id = ?',
        [titulo, autor, ano_publicacao, isbn, disponivel, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro no model update:', error);
      throw error;
    }
  },

  // Excluir livro
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM livros WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro no model delete:', error);
      throw error;
    }
  },

  // Buscar livros disponíveis
  async findDisponiveis() {
    try {
      const [rows] = await pool.query('SELECT * FROM livros WHERE disponivel = TRUE ORDER BY titulo');
      return rows;
    } catch (error) {
      console.error('Erro no model findDisponiveis:', error);
      throw error;
    }
  }
};

module.exports = livroModel;
