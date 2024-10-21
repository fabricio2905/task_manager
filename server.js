const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware para processar os dados enviados no corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configurando sessões
app.use(session({
  secret: 'chave-secreta', 
  resave: false,
  saveUninitialized: true,
}));


// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erro no servidor');
      } else if (row) {
          req.session.usuario = username;  // Armazena o nome do usuário na sessão
          res.redirect('/index.html');
      } else {
          res.status(401).send('Usuário ou senha incorretos');
      }
  });
});


// Rota para adicionar um processo
app.post('/add-processo', (req, res) => {
  const { nome, pid, usoCpu, usoMemoria, disco, prioridade, estado } = req.body;
  
  // Recuperar o nome do usuário logado da sessão
  const usuario = req.session.usuario;

  // Se o usuário não estiver na sessão, enviar erro
  if (!usuario) {
      return res.status(401).send('Usuário não logado.');
  }

  // Inserir o processo no banco de dados com o nome do usuário
  db.run(`INSERT INTO processos (nome, pid, usoCpu, usoMemoria, disco, prioridade, estado, usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, pid, usoCpu, usoMemoria, disco, prioridade, estado, usuario], function (err) {
          if (err) {
              console.error(err);
              res.status(500).send('Erro ao salvar o processo no banco de dados');
          } else {
              res.status(200).send('Processo salvo com sucesso!');
          }
      });
});


// Rota para obter todos os processos
app.get('/processos', (req, res) => {
    db.all('SELECT * FROM processos', [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao recuperar os processos');
        } else {
            res.json(rows);
        }
    });
});

// Rota para remover um processo
app.delete('/processos/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM processos WHERE id = ?', [id], function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao remover o processo');
        } else if (this.changes === 0) {
            res.status(404).send('Processo não encontrado');
        } else {
            res.status(200).send('Processo removido com sucesso');
        }
    });
});

// Inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/login.html`);
});
