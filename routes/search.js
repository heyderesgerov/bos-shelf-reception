const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Əməkdaşları adına görə axtarmaq üçün API endpoint
router.get('/employees', (req, res) => {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: "Axtarış üçün ad daxil edilməyib." });
  }

  try {
    // SQL sorğusu ilə ad üzrə qismən axtarış (LIKE) edirik
    const stmt = db.prepare('SELECT id, name, department, room_number, qr_code FROM employees WHERE name LIKE ?');
    const results = stmt.all(`%${name}%`);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Server xətası baş verdi." });
  }
});

// 2. Görüş otaqlarını və onların statusunu gətirmək üçün API endpoint
router.get('/rooms', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, name, floor, status FROM meeting_rooms');
    const rooms = stmt.all();
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server xətası baş verdi." });
  }
});

module.exports = router;
