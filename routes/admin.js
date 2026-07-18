const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Yeni əməkdaş əlavə etmək (Create)
router.post('/employees', (req, res) => {
  const { name, department, room_number, qr_code } = req.body;

  if (!name || !room_number) {
    return res.status(400).json({ error: "Ad və otaq nömrəsi mütləqdir." });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO employees (name, department, room_number, qr_code)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(name, department, room_number, qr_code || `emp_${Date.now()}`);
    
    res.status(201).json({ message: "Əməkdaş uğurla əlavə edildi", id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Məlumat bazasına yazılarkən xəta baş verdi." });
  }
});

// 2. Əməkdaş məlumatını yeniləmək (Update)
router.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, department, room_number } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE employees SET name = ?, department = ?, room_number = ? WHERE id = ?
    `);
    const info = stmt.run(name, department, room_number, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Əməkdaş tapılmadı." });
    }
    res.json({ message: "Əməkdaş məlumatları yeniləndi." });
  } catch (error) {
    res.status(500).json({ error: "Yenilənmə zamanı xəta baş verdi." });
  }
});

// 3. Əməkdaşı sistemdən silmək (Delete)
router.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Əməkdaş tapılmadı." });
    }
    res.json({ message: "Əməkdaş sistemdən silindi." });
  } catch (error) {
    res.status(500).json({ error: "Silinmə zamanı xəta baş verdi." });
  }
});

module.exports = router;
