const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db')

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS qrcodes (
      id TEXT PRIMARY KEY,
      original_url TEXT
    )
  `)

})

module.exports = db