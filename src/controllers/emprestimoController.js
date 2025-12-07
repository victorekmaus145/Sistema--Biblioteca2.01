const pool = require('../config/database');

// ========== CRIAR EMPRÉSTIMO (COM ATUALIZAÇÃO DO STATUS) ==========
const criarEmprestimo = async (req, res) => {
  const { usuario_id, livro_id } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('🔄 Criando empréstimo - Livro ID:', livro_id, 'Usuário ID:', usuario_id);
    
    // 1. VERIFICAR SE O LIVRO EXISTE E ESTÁ DISPONÍVEL
    const [livro] = await connection.query(
      'SELECT id, titulo, disponivel FROM livros WHERE id = ? FOR UPDATE',
      [livro_id]
    );
    
    if (livro.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        error: 'Livro não encontrado' 
      });
    }
    
    // Verificar disponibilidade (disponivel = 1 = TRUE, 0 = FALSE)
    if (livro[0].disponivel === 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        error: `O livro "${livro[0].titulo}" não está disponível para empréstimo`
      });
    }
    
    // 2. VERIFICAR SE O USUÁRIO EXISTE
    const [usuario] = await connection.query(
      'SELECT id, nome FROM usuarios WHERE id = ?',
      [usuario_id]
    );
    
    if (usuario.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado' 
      });
    }
    
    // 3. CRIAR O REGISTRO DE EMPRÉSTIMO
    const [result] = await connection.query(
      'INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo) VALUES (?, ?, CURDATE())',
      [usuario_id, livro_id]
    );
    
    console.log('✅ Empréstimo criado com ID:', result.insertId);
    
    // 4. ATUALIZAR O LIVRO PARA INDISPONÍVEL (disponivel = 0)
    await connection.query(
      'UPDATE livros SET disponivel = 0 WHERE id = ?',
      [livro_id]
    );
    
    console.log('✅ Livro ID', livro_id, 'atualizado para INDISPONÍVEL');
    
    await connection.commit();
    
    res.status(201).json({ 
      success: true,
      message: 'Empréstimo realizado com sucesso!',
      data: {
        emprestimo_id: result.insertId,
        livro_id: livro_id,
        livro_titulo: livro[0].titulo,
        usuario_nome: usuario[0].nome,
        disponivel: false
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro ao criar empréstimo:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Erro ao criar empréstimo',
      detalhes: error.message 
    });
  } finally {
    connection.release();
  }
};

// ========== FINALIZAR EMPRÉSTIMO (DEVOLUÇÃO) ==========
const finalizarEmprestimo = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    console.log('🔄 Finalizando empréstimo ID:', id);
    
    // 1. BUSCAR O EMPRÉSTIMO
    const [emprestimo] = await connection.query(
      'SELECT e.*, l.titulo, u.nome FROM emprestimos e ' +
      'JOIN livros l ON e.livro_id = l.id ' +
      'JOIN usuarios u ON e.usuario_id = u.id ' +
      'WHERE e.id = ?',
      [id]
    );
    
    if (emprestimo.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        error: 'Empréstimo não encontrado' 
      });
    }
    
    const emprestimoData = emprestimo[0];
    
    // Verificar se já foi devolvido
    if (emprestimoData.data_devolvida) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        error: 'Este empréstimo já foi finalizado' 
      });
    }
    
    // 2. ATUALIZAR DATA DE DEVOLUÇÃO
    await connection.query(
      'UPDATE emprestimos SET data_devolvida = CURDATE() WHERE id = ?',
      [id]
    );
    
    console.log('✅ Data de devolução registrada para empréstimo ID:', id);
    
    // 3. ATUALIZAR O LIVRO PARA DISPONÍVEL (disponivel = 1)
    await connection.query(
      'UPDATE livros SET disponivel = 1 WHERE id = ?',
      [emprestimoData.livro_id]
    );
    
    console.log('✅ Livro ID', emprestimoData.livro_id, 'atualizado para DISPONÍVEL');
    
    await connection.commit();
    
    res.status(200).json({ 
      success: true,
      message: 'Devolução realizada com sucesso!',
      data: {
        emprestimo_id: id,
        livro_id: emprestimoData.livro_id,
        livro_titulo: emprestimoData.titulo,
        usuario_nome: emprestimoData.nome,
        disponivel: true
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro ao finalizar empréstimo:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Erro ao finalizar empréstimo',
      detalhes: error.message 
    });
  } finally {
    connection.release();
  }
};

// ========== LISTAR EMPRÉSTIMOS ==========
const listarEmprestimos = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT e.*, l.titulo as livro_titulo, u.nome as usuario_nome ' +
      'FROM emprestimos e ' +
      'JOIN livros l ON e.livro_id = l.id ' +
      'JOIN usuarios u ON e.usuario_id = u.id ' +
      'ORDER BY e.data_emprestimo DESC'
    );
    
    res.status(200).json({ 
      success: true,
      data: result 
    });
  } catch (error) {
    console.error('❌ Erro ao listar empréstimos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar empréstimos' 
    });
  }
};

// ========== BUSCAR EMPRÉSTIMOS ATIVOS ==========
const listarEmprestimosAtivos = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT e.*, l.titulo as livro_titulo, u.nome as usuario_nome ' +
      'FROM emprestimos e ' +
      'JOIN livros l ON e.livro_id = l.id ' +
      'JOIN usuarios u ON e.usuario_id = u.id ' +
      'WHERE e.data_devolvida IS NULL ' +
      'ORDER BY e.data_emprestimo DESC'
    );
    
    res.status(200).json({ 
      success: true,
      data: result 
    });
  } catch (error) {
    console.error('❌ Erro ao listar empréstimos ativos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao listar empréstimos ativos' 
    });
  }
};

module.exports = {
  criarEmprestimo,
  finalizarEmprestimo,
  listarEmprestimos,
  listarEmprestimosAtivos
};