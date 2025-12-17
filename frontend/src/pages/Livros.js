import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Livros = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Carregar livros da API
  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      const response = await api.get('/livros');
      setLivros(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar livros: ' + err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${titulo}"?\n\nEsta ação não pode ser desfeita.`)) {
      try {
        await api.delete(`/livros/${id}`);
        alert('✅ Livro excluído com sucesso!');
        carregarLivros(); // Recarregar lista
      } catch (err) {
        const errorDetails = err.response?.data;
        let errorMsg = '❌ Erro ao excluir livro';
        
        if (errorDetails?.details) {
          errorMsg += `:\n${errorDetails.details}`;
          if (errorDetails.suggestion) {
            errorMsg += `\n\n💡 ${errorDetails.suggestion}`;
          }
        } else if (err.message) {
          errorMsg += `:\n${err.message}`;
        }
        
        alert(errorMsg);
      }
    }
  };

  const handleEditar = (id) => {
    navigate(`/livros/editar/${id}`);
  };

  const handleEmprestar = (livro) => {
    navigate('/emprestimos/novo', { state: { livro } });
  };

  const handleDesativar = async (id, titulo, ativo) => {
    const acao = ativo ? 'desativar' : 'ativar';
    if (window.confirm(`Tem certeza que deseja ${acao} o livro "${titulo}"?`)) {
      try {
        await api.put(`/livros/${id}`, { disponivel: !ativo });
        alert(`✅ Livro ${acao === 'desativar' ? 'desativado' : 'ativado'} com sucesso!`);
        carregarLivros();
      } catch (err) {
        alert('❌ Erro ao atualizar livro: ' + err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>📚 Gerenciar Livros</h1>
          <p style={{ color: '#6b7280' }}>Total: {livros.length} livros cadastrados</p>
        </div>
        <button 
          onClick={() => navigate('/livros/novo')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>+</span> Novo Livro
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          borderLeft: '4px solid #dc2626'
        }}>
          ⚠️ {error}
        </div>
      )}

      {livros.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#6b7280' }}>Nenhum livro cadastrado ainda</p>
          <button 
            onClick={() => navigate('/livros/novo')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cadastrar Primeiro Livro
          </button>
        </div>
      ) : (
        <>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            marginBottom: '2rem'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Título</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Autor</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ano</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {livros.map(livro => (
                  <tr key={livro.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#6b7280' }}>{livro.id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{livro.titulo}</td>
                    <td style={{ padding: '1rem' }}>{livro.autor}</td>
                    <td style={{ padding: '1rem' }}>{livro.ano_publicacao || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: livro.disponivel ? '#d1fae5' : '#fee2e2',
                        color: livro.disponivel ? '#065f46' : '#991b1b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {livro.disponivel ? '✅ Disponível' : '⛔ Emprestado'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleEditar(livro.id)}
                          style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title="Editar livro"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(livro.id, livro.titulo)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #fecaca',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title="Excluir livro"
                        >
                          🗑️ Excluir
                        </button>
                        <button
                          onClick={() => handleDesativar(livro.id, livro.titulo, livro.disponivel)}
                          style={{
                            backgroundColor: livro.disponivel ? '#fef3c7' : '#d1fae5',
                            color: livro.disponivel ? '#92400e' : '#065f46',
                            padding: '0.5rem 0.75rem',
                            border: livro.disponivel ? '1px solid #fde68a' : '1px solid #a7f3d0',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title={livro.disponivel ? 'Marcar como indisponível' : 'Marcar como disponível'}
                        >
                          {livro.disponivel ? '⛔ Desativar' : '✅ Ativar'}
                        </button>
                        {livro.disponivel && (
                          <button
                            onClick={() => handleEmprestar(livro)}
                            style={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #bfdbfe',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Emprestar este livro"
                          >
                            📖 Emprestar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estatísticas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>{livros.length}</div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Total de Livros</div>
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                {livros.filter(l => l.disponivel).length}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Disponíveis</div>
            </div>
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {livros.filter(l => !l.disponivel).length}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Emprestados</div>
            </div>
            <div style={{
              backgroundColor: '#faf5ff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                {new Set(livros.map(l => l.autor)).size}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Autores Únicos</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Livros;
