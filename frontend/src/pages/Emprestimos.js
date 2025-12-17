import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Emprestimos = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimosAtivos, setEmprestimosAtivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ativos'); // 'ativos' ou 'todos'
  const navigate = useNavigate();

  // Carregar empréstimos da API
  useEffect(() => {
    carregarEmprestimos();
  }, []);

const carregarEmprestimos = async () => {
  try {
    setLoading(true);
    
    // Carregar todos os empréstimos
    const [todosResponse, ativosResponse] = await Promise.all([
      api.get('/emprestimos'),
      api.get('/emprestimos/ativos')
    ]);
    
    // CORREÇÃO COM VERIFICAÇÃO DE SEGURANÇA:
    // Verifica se a resposta existe e tem a estrutura esperada
    const todosData = todosResponse?.data?.data || todosResponse?.data || [];
    const ativosData = ativosResponse?.data?.data || ativosResponse?.data || [];
    
    // DEBUG (opcional - pode remover depois)
    console.log('Todos Response:', todosResponse);
    console.log('Ativos Response:', ativosResponse);
    console.log('Todos Data:', todosData);
    console.log('Ativos Data:', ativosData);
    
    setEmprestimos(todosData);
    setEmprestimosAtivos(ativosData);
    setError('');
  } catch (err) {
    setError('Erro ao carregar empréstimos: ' + err.message);
    console.error('Erro:', err);
  } finally {
    setLoading(false);
  }
};
  const handleDevolver = async (id, livroTitulo) => {
    if (window.confirm(`Confirmar devolução do livro "${livroTitulo}"?`)) {
      try {
        await api.put(`/emprestimos/${id}/devolver`);
        alert('✅ Livro devolvido com sucesso!');
        carregarEmprestimos(); // Recarregar lista
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message;
        alert(`❌ Erro ao devolver livro: ${errorMsg}`);
      }
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const calcularDiasAtraso = (dataDevolucao, dataDevolvida) => {
    if (dataDevolvida) return 0; // Já devolvido
    
    const hoje = new Date();
    const devolucao = new Date(dataDevolucao);
    const diffTime = hoje - devolucao;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const dadosParaExibir = activeTab === 'ativos' ? emprestimosAtivos : emprestimos;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>🔄 Gerenciar Empréstimos</h1>
          <p style={{ color: '#6b7280' }}>
            {emprestimosAtivos.length} empréstimo(s) ativo(s) • {emprestimos.length} histórico total
          </p>
        </div>
        <button 
          onClick={() => navigate('/emprestimos/novo')}
          style={{
            backgroundColor: '#10b981',
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
          <span style={{ fontSize: '1.25rem' }}>+</span> Novo Empréstimo
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

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('ativos')}
          style={{
            backgroundColor: activeTab === 'ativos' ? '#3b82f6' : 'transparent',
            color: activeTab === 'ativos' ? 'white' : '#6b7280',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem 0.375rem 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'ativos' ? '600' : '400'
          }}
        >
          ⏳ Empréstimos Ativos ({emprestimosAtivos.length})
        </button>
        <button
          onClick={() => setActiveTab('todos')}
          style={{
            backgroundColor: activeTab === 'todos' ? '#3b82f6' : 'transparent',
            color: activeTab === 'todos' ? 'white' : '#6b7280',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem 0.375rem 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'todos' ? '600' : '400'
          }}
        >
          📋 Todos os Empréstimos ({emprestimos.length})
        </button>
      </div>

      {dadosParaExibir.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {activeTab === 'ativos' ? '⏳' : '📋'}
          </div>
          <p style={{ fontSize: '1.125rem', marginBottom: '1rem', color: '#6b7280' }}>
            {activeTab === 'ativos' 
              ? 'Nenhum empréstimo ativo no momento' 
              : 'Nenhum empréstimo registrado'}
          </p>
          {activeTab === 'ativos' && (
            <button 
              onClick={() => navigate('/emprestimos/novo')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Fazer Primeiro Empréstimo
            </button>
          )}
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
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Livro</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Usuário</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Empréstimo</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Devolução</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dadosParaExibir.map(emprestimo => {
                  const diasAtraso = calcularDiasAtraso(emprestimo.data_devolucao, emprestimo.data_devolvida);
                  const estaAtrasado = diasAtraso > 0 && !emprestimo.data_devolvida;
                  
                  return (
                    <tr key={emprestimo.id} style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: estaAtrasado ? '#fef2f2' : 'white'
                    }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#6b7280' }}>{emprestimo.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{emprestimo.livro_titulo}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{emprestimo.livro_autor}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{emprestimo.usuario_nome}</td>
                      <td style={{ padding: '1rem' }}>
                        {formatarData(emprestimo.data_emprestimo)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>{formatarData(emprestimo.data_devolucao)}</div>
                        {emprestimo.data_devolvida && (
                          <div style={{ fontSize: '0.875rem', color: '#059669' }}>
                            Devolvido: {formatarData(emprestimo.data_devolvida)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          backgroundColor: emprestimo.data_devolvida 
                            ? '#d1fae5' 
                            : estaAtrasado 
                              ? '#fee2e2' 
                              : '#fef3c7',
                          color: emprestimo.data_devolvida 
                            ? '#065f46' 
                            : estaAtrasado 
                              ? '#991b1b' 
                              : '#92400e',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {emprestimo.data_devolvida 
                            ? '✅ Devolvido' 
                            : estaAtrasado 
                              ? `⏰ Atrasado ${diasAtraso} dia(s)` 
                              : '⏳ Em andamento'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {!emprestimo.data_devolvida && (
                            <button
                              onClick={() => handleDevolver(emprestimo.id, emprestimo.livro_titulo)}
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #34d399',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Registrar devolução"
                            >
                              📚 Devolver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>{emprestimos.length}</div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Total de Empréstimos</div>
            </div>
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>
                {emprestimosAtivos.length}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Empréstimos Ativos</div>
            </div>
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {emprestimosAtivos.filter(e => 
                  calcularDiasAtraso(e.data_devolucao, e.data_devolvida) > 0
                ).length}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Em Atraso</div>
            </div>
            <div style={{
              backgroundColor: '#faf5ff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                {emprestimos.filter(e => e.data_devolvida).length}
              </div>
              <div style={{ color: '#4b5563', fontWeight: '500' }}>Devolvidos</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Emprestimos;
