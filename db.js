const Database = require('better-sqlite3');
const path = require('path');

// Bazanı layihənin kök qovluğunda 'reception.db' faylı olaraq yaradırıq
const db = new Database(path.join(__dirname, 'reception.db'));

// Cədvəllərin yaradılması (Sxem)
db.exec(`
  -- Əməkdaşlar cədvəli
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT,
    room_number TEXT NOT NULL,
    qr_code TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Meeting Room (Görüş Otaqları) cədvəli
  CREATE TABLE IF NOT EXISTS meeting_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    floor INTEGER,
    status TEXT DEFAULT 'free' -- 'free' və ya 'busy'
  );

  -- Admin istifadəçiləri cədvəli
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("SQLite Verilənlər bazası və cədvəllər uğurla hazırlandı.");

module.exports = db;
