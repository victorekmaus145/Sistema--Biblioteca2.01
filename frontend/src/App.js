import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Livros from './pages/Livros';
import LivroForm from './pages/LivroForm';
import Emprestimos from './pages/Emprestimos';
import NovoEmprestimo from './pages/NovoEmprestimo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="livros" element={<Livros />} />
          <Route path="livros/novo" element={<LivroForm />} />
          <Route path="livros/editar/:id" element={<LivroForm />} />
          <Route path="emprestimos" element={<Emprestimos />} />
          <Route path="emprestimos/novo" element={<NovoEmprestimo />} />
          <Route path="usuarios" element={<div className="container main-content"><h1>Usuários - Em breve!</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
