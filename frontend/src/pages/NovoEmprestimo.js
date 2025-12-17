import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const NovoEmprestimo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const livroPreSelecionado = location.state?.livro;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([]);
  
  const [formData, setFormData] = useState({
    usuario_id: '',
    livro_id: livroPreSelecionado?.id || '',
    data_devolucao: ''
  });

  const [erros, setErros] = useState({});

  // Carregar dados necessários
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar usuários e livros disponíveis em paralelo
      const [usuariosResponse, livrosResponse] = await Promise.all([
        api.get('/usuarios'),
        api.get('/livros/disponiveis')
      ]);
      
      setUsuarios(usuariosResponse.data);
      setLivrosDisponiveis(livrosResponse.data);
      
      // Se veio com livro pré-selecionado, definir como selecionado
      if (livroPreSelecionado) {
        setFormData(prev => ({
          ...prev,
          livro_id: livroPreSelecionado.id.toString()
        }));
      }
      
    } catch (err) {
      alert('Erro ao carregar dados: ' + err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.usuario_id) {
      novosErros.usuario_id = 'Selecione um usuário';
    }
    
    if (!formData.livro_id) {
      novosErros.livro_id = 'Selecione um livro';
    }
    
    if (!formData.data_devolucao) {
      novosErros.data_devolucao = 'Informe a data de devolução';
    } else {
      const dataDevolucao = new Date(formData.data_devolucao);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataDevolucao < hoje) {
        novosErros.data_devolucao = 'A data de devolução não pode ser no passado';
      }
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setSaving(true);
      
      await api.post('/emprestimos', {
        usuario_id: parseInt(formData.usuario_id),
        livro_id: parseInt(formData.livro_id)
        // data_devolucao é calculada pelo backend (geralmente 15 dias)
      });
      
      alert('✅ Empréstimo registrado com sucesso!');
      navigate('/emprestimos');
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert(`❌ Erro ao registrar empréstimo: ${errorMsg}`);
      console.error('Detalhes do erro:', err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  // Calcular data de devolução padrão (15 dias a partir de hoje)
  const calcularDataDevolucaoPadrao = () => {
    const data = new Date();
    data.setDate(data.getDate() + 15); // 15 dias
    return data.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  // Definir data de devolução padrão no carregamento
  useEffect(() => {
    if (!formData.data_devolucao) {
      setFormData(prev => ({
        ...prev,
        data_devolucao: calcularDataDevolucaoPadrao()
      }));
    }
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container main-content">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1>📖 Novo Empréstimo</h1>
          <p style={{ color: '#6b7280' }}>
            {livroPreSelecionado 
              ? `Emprestando: "${livroPreSelecionado.titulo}"`
              : 'Registre um novo empréstimo de livro'}
          </p>
        </div>
        <button
          onClick={() => navigate('/emprestimos')}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          ← Voltar
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Usuário */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Usuário *
            </label>
            <select
              name="usuario_id"
              value={formData.usuario_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${erros.usuario_id ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="">Selecione um usuário...</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome} ({usuario.email})
                </option>
              ))}
            </select>
            {erros.usuario_id && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ⚠️ {erros.usuario_id}
              </div>
            )}
          </div>

          {/* Livro */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Livro *
            </label>
            <select
              name="livro_id"
              value={formData.livro_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${erros.livro_id ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '1rem',
                backgroundColor: 'white'
              }}
              required
              disabled={!!livroPreSelecionado}
            >
              <option value="">Selecione um livro...</option>
              {livrosDisponiveis.map(livro => (
                <option key={livro.id} value={livro.id}>
                  {livro.titulo} - {livro.autor} {livro.ano_publicacao ? `(${livro.ano_publicacao})` : ''}
                </option>
              ))}
            </select>
            {erros.livro_id && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ⚠️ {erros.livro_id}
              </div>
            )}
            {livroPreSelecionado && (
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '0.75rem', 
                borderRadius: '0.375rem',
                marginTop: '0.5rem',
                fontSize: '0.875rem',
                color: '#0369a1'
              }}>
                📚 Livro pré-selecionado: <strong>{livroPreSelecionado.titulo}</strong>
              </div>
            )}
          </div>

          {/* Data de Devolução */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Data Prevista para Devolução *
            </label>
            <input
              type="date"
              name="data_devolucao"
              value={formData.data_devolucao}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${erros.data_devolucao ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            {erros.data_devolucao && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                ⚠️ {erros.data_devolucao}
              </div>
            )}
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginTop: '0.5rem',
              backgroundColor: '#f9fafb',
              padding: '0.5rem',
              borderRadius: '0.25rem'
            }}>
              ⏰ Prazo sugerido: 15 dias a partir de hoje
            </div>
          </div>

          {/* Resumo */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '1.5rem', 
            borderRadius: '0.375rem',
            marginBottom: '2rem',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Resumo do Empréstimo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Usuário:</div>
                <div style={{ fontWeight: '500' }}>
                  {formData.usuario_id 
                    ? usuarios.find(u => u.id === parseInt(formData.usuario_id))?.nome || 'Não selecionado'
                    : 'Não selecionado'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Livro:</div>
                <div style={{ fontWeight: '500' }}>
                  {formData.livro_id 
                    ? livrosDisponiveis.find(l => l.id === parseInt(formData.livro_id))?.titulo || 'Não selecionado'
                    : 'Não selecionado'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Data de Empréstimo:</div>
                <div style={{ fontWeight: '500' }}>{new Date().toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Data de Devolução:</div>
                <div style={{ fontWeight: '500' }}>
                  {formData.data_devolucao 
                    ? new Date(formData.data_devolucao).toLocaleDateString('pt-BR')
                    : 'Não informada'}
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={() => navigate('/emprestimos')}
              style={{
                backgroundColor: 'white',
                color: '#374151',
                padding: '0.75rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: saving ? '#9ca3af' : '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {saving ? (
                <>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Registrando...
                </>
              ) : (
                <>
                  📖 Registrar Empréstimo
                </>
              )}
            </button>
          </div>
        </form>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default NovoEmprestimo;
