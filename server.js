const express = require('express');
const db = require('./database');
const app = express();
const port = 3000;  

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erro no servidor');
      } else if (row) {
          res.redirect('/index.html');
      } else {
          res.status(401).send('Usuário ou senha incorretos');
      }
  });
});


// Rota para adicionar um processo
app.post('/add-processo', (req, res) => {
  const { pid, usoCpu, usoMemoria, disco, prioridade, estado } = req.body;

  // Inserir o processo no banco de dados
  db.run(`INSERT INTO processos (pid, usoCpu, usoMemoria, disco, prioridade, estado, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pid, usoCpu, usoMemoria, disco, prioridade, estado, usuario], function (err) {
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
app.delete('/processos/:id', (req) => {
    const id = req.params.id;
    db.run('DELETE FROM processos WHERE id = ?', [id], function() {
    });
});

// Inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
