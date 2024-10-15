const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// Criar tabela de usuários
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  // Criar tabela de processos
  db.run(`CREATE TABLE IF NOT EXISTS processos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pid TEXT,
    usoCpu INTEGER,
    usoMemoria INTEGER,
    disco INTEGER,
    prioridade TEXT,
    estado TEXT,
    usuario TEXT
  )`);
});

module.exports = db;