const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db'); // Conectando ao arquivo SQLite

// Criando a tabela de usuários (caso ainda não exista)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`);
});

module.exports = db;


// Criando a tabela de processos
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS processos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pid INTEGER,
    usoCpu INTEGER,
    usoMemoria INTEGER,
    disco INTEGER,
    prioridade TEXT,
    estado TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

module.exports = db;
