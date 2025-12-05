# 📚 Sistema de Gerenciamento de Biblioteca

Sistema completo para gerenciamento de bibliotecas desenvolvido como projeto da faculdade. Permite cadastrar livros, gerenciar empréstimos e controlar devoluções.

## ✨ Funcionalidades

- ✅ Cadastro de livros (título, autor, ano, ISBN)
- ✅ Controle de empréstimos e devoluções
- ✅ Gestão de usuários
- ✅ Interface web intuitiva
- ✅ API RESTful completa

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL
- NPM ou Yarn

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/victorekmaus145/Sistema--Biblioteca2.01.git
cd Sistema--Biblioteca2.01

### Passo 2:Configurar o Banco de Dados

# Conecte ao MySQL
mysql -u root -p

# Crie o banco de dados
CREATE DATABASE biblioteca;

# Use o banco
USE biblioteca;

### Passo 3: Configurar o Backend

# Entre na pasta do backend
cd src

# Instale as dependências
npm install

# Configure as variáveis de ambiente (crie arquivo .env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=biblioteca
PORT=3001

# Inicie o servidor backend
npm start

### Passo 4: Configurar o Frontend

# Abra outro terminal
cd frontend

# Instale as dependências
npm install

# Inicie o frontend
npm start

### Passo 5: Acessar a Aplicação
Frontend: http://localhost:3000

Backend API: http://localhost:3001

🛠️ Tecnologias Utilizadas
Backend: Node.js, Express.js, MySQL

Frontend: React.js

Banco de Dados: MySQL

Outras: Axios, CORS, dotenv


👨‍💻 Autor
Victor Emanuel Gomes da Silva
Projeto desenvolvido para a disciplina de Banco de Dados da faculdade.

📄 Observações
Este projeto foi desenvolvido para fins educacionais

Pode ser usado como base para outros projetos similares

Sinta-se à vontade para fazer melhorias
