const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db')

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS qrcodes (
      id TEXT PRIMARY KEY,
      original_url TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)

  db.run(`
    INSERT OR IGNORE INTO users (email, password)
    VALUES ('admin@qrcode.com', 'admin123')
  `)

})

module.exports = db