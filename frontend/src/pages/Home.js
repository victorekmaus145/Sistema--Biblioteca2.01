import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container main-content">
      <div style={{
        background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
        color: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚 Bem-vindo à Biblioteca Digital</h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
          Gerencie seu acervo, usuários e empréstimos de forma fácil e eficiente
        </p>
      </div>

      <div className="card-grid">
        <Link to="/livros" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gerenciar Livros</h3>
            <p>Cadastre, edite e exclua livros do acervo</p>
          </div>
        </Link>

        <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gerenciar Usuários</h3>
          <p>(Em breve)</p>
        </div>

        <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Gerenciar Empréstimos</h3>
          <p>(Em breve)</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>📊 Estatísticas Rápidas</h3>
          <p>Total de Livros: <strong>Carregando...</strong></p>
          <p>Usuários Cadastrados: <strong>Carregando...</strong></p>
          <p>Empréstimos Ativos: <strong>Carregando...</strong></p>
          <button 
            onClick={() => window.location.href = 'http://localhost:3000'}
            style={{
              marginTop: '1rem',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Ver API
          </button>
        </div>

        <div className="card">
          <h3 style={{ color: '#7c3aed', marginBottom: '1rem' }}>⚡ Comece Agora</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/livros">Cadastre seus livros</Link></li>
            <li style={{ marginBottom: '0.5rem' }}>Registre os usuários</li>
            <li style={{ marginBottom: '0.5rem' }}>Faça empréstimos</li>
            <li>Controle devoluções</li>
          </ol>
          <Link to="/livros">
            <button
              style={{
                marginTop: '1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                width: '100%',
                fontSize: '1rem'
              }}
            >
              Começar com Livros →
            </button>
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f0f9ff', borderLeft: '4px solid #0ea5e9' }}>
        <h3 style={{ color: '#0369a1', marginBottom: '1rem' }}>ℹ️ Sistema Funcionando</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          <span>Backend API: <code>http://localhost:3000</code></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          <span>Frontend React: <code>http://localhost:3001</code></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          <span>Banco de Dados: MySQL conectado</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
