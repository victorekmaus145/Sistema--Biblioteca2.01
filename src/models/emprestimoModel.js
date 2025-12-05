const pool = require('../config/database');

const emprestimoModel = {
  // Buscar todos os empréstimos
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT e.*, 
               u.nome as usuario_nome, u.email as usuario_email,
               l.titulo as livro_titulo, l.autor as livro_autor
        FROM emprestimos e
        JOIN usuarios u ON e.usuario_id = u.id
        JOIN livros l ON e.livro_id = l.id
        ORDER BY e.data_emprestimo DESC
      `);
      return rows;
    } catch (error) {
      console.error('Erro no model findAll empréstimos:', error);
      throw error;
    }
  },

  // Buscar empréstimo por ID
  async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT e.*, 
               u.nome as usuario_nome, u.email as usuario_email,
               l.titulo as livro_titulo, l.autor as livro_autor
        FROM emprestimos e
        JOIN usuarios u ON e.usuario_id = u.id
        JOIN livros l ON e.livro_id = l.id
        WHERE e.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Erro no model findById empréstimos:', error);
      throw error;
    }
  },

  // Criar novo empréstimo
  async create(emprestimo) {
    try {
      const { usuario_id, livro_id } = emprestimo;
      
      // Verificar se livro está disponível
      const [livroRows] = await pool.query(
        'SELECT disponivel FROM livros WHERE id = ?',
        [livro_id]
      );
      
      if (!livroRows[0] || !livroRows[0].disponivel) {
        throw new Error('Livro não está disponível para empréstimo');
      }
      
      const [result] = await pool.query(
        'INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo) VALUES (?, ?, CURDATE())',
        [usuario_id, livro_id]
      );
      
      return { id: result.insertId, ...emprestimo };
    } catch (error) {
      console.error('Erro no model create empréstimos:', error);
      throw error;
    }
  },

  // Devolver livro
  async devolver(id) {
    try {
      const [result] = await pool.query(
        'UPDATE emprestimos SET data_devolvida = CURDATE() WHERE id = ? AND data_devolvida IS NULL',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Erro no model devolver:', error);
      throw error;
    }
  },

  // Buscar empréstimos ativos
  async findAtivos() {
    try {
      const [rows] = await pool.query(`
        SELECT e.*, 
               u.nome as usuario_nome,
               l.titulo as livro_titulo, l.autor as livro_autor
        FROM emprestimos e
        JOIN usuarios u ON e.usuario_id = u.id
        JOIN livros l ON e.livro_id = l.id
        WHERE e.data_devolvida IS NULL
        ORDER BY e.data_emprestimo DESC
      `);
      return rows;
    } catch (error) {
      console.error('Erro no model findAtivos:', error);
      throw error;
    }
  },

  // Buscar empréstimos por usuário
  async findByUsuario(usuarioId) {
    try {
      const [rows] = await pool.query(`
        SELECT e.*, l.titulo as livro_titulo, l.autor as livro_autor
        FROM emprestimos e
        JOIN livros l ON e.livro_id = l.id
        WHERE e.usuario_id = ?
        ORDER BY e.data_emprestimo DESC
      `, [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro no model findByUsuario:', error);
      throw error;
    }
  },

  // Buscar empréstimos ativos por usuário
  async findAtivosByUsuario(usuarioId) {
    try {
      const [rows] = await pool.query(`
        SELECT e.*, l.titulo as livro_titulo, l.autor as livro_autor
        FROM emprestimos e
        JOIN livros l ON e.livro_id = l.id
        WHERE e.usuario_id = ? AND e.data_devolvida IS NULL
        ORDER BY e.data_emprestimo DESC
      `, [usuarioId]);
      return rows;
    } catch (error) {
      console.error('Erro no model findAtivosByUsuario:', error);
      throw error;
    }
  },

  // Verificar se usuário já tem o livro emprestado
  async verificarEmprestimoAtivo(usuarioId, livroId) {
    try {
      const [rows] = await pool.query(
        'SELECT id FROM emprestimos WHERE usuario_id = ? AND livro_id = ? AND data_devolvida IS NULL',
        [usuarioId, livroId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Erro no model verificarEmprestimoAtivo:', error);
      throw error;
    }
  }
};

module.exports = emprestimoModel;
