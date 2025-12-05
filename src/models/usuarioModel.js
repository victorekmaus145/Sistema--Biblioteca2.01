const pool = require('../config/database');

const usuarioModel = {
  // Buscar todos os usuários
  async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY nome');
      return rows;
    } catch (error) {
      console.error('Erro no model findAll usuarios:', error);
      throw error;
    }
  },

  // Buscar usuário por ID
  async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro no model findById usuarios:', error);
      throw error;
    }
  },

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Erro no model findByEmail:', error);
      throw error;
    }
  },

  // Criar novo usuário
  async create(usuario) {
    try {
      const { nome, email, telefone } = usuario;
      const [result] = await pool.query(
        'INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)',
        [nome, email, telefone]
      );
      return { id: result.insertId, ...usuario };
    } catch (error) {
      console.error('Erro no model create usuarios:', error);
      throw error;
    }
  },

  // Atualizar usuário
  async update(id, usuario) {
    try {
      const { nome, email, telefone } = usuario;
      const [result] = await pool.query(
        'UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [nome, email, telefone, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro no model update usuarios:', error);
      throw error;
    }
  },

  // Excluir usuário
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro no model delete usuarios:', error);
      throw error;
    }
  }
};

module.exports = usuarioModel;
