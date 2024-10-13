const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

// Middleware para processar os dados enviados no corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve os arquivos HTML, CSS e JavaScript

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro no servidor');
    } else if (row) {
      res.redirect('/index.html'); // Redireciona para a página de processos se o login for bem-sucedido
    } else {
      res.status(401).send('Usuário ou senha incorretos');
    }
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
