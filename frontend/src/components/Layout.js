import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <span role="img" aria-label="book">📚</span>
            <span>Biblioteca Digital</span>
          </div>
          <nav className="nav">
            <Link to="/">🏠 Início</Link>
            <Link to="/livros">📚 Livros</Link>
            <Link to="/emprestimos">🔄 Empréstimos</Link>
            <Link to="/usuarios">👥 Usuários</Link>
          </nav>
        </div>
      </header>
      
      <Outlet />
      
      <footer className="footer">
        <div className="container">
          <p>Sistema de Biblioteca - {new Date().getFullYear()}</p>
          <p>Node.js + Express + MySQL + React</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
