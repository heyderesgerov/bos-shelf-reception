const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin girişi (Login) üçün API endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "İstifadəçi adı və şifrə mütləqdir." });
  }

  try {
    // Bazadan admini istifadəçi adına görə axtarırıq
    const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
    const admin = stmt.get(username);

    if (!admin) {
      return res.status(401).json({ error: "İstifadəçi adı və ya şifrə yanlışdır." });
    }

    // Şifrə yoxlanışı (Sırf ilkin test mərhələsi üçün sadə müqayisə)
    if (admin.password !== password) {
      return res.status(401).json({ error: "İstifadəçi adı və ya şifrə yanlışdır." });
    }

    // Giriş uğurlu olduqda geriyə mesaj və istifadəçi məlumatı qaytarırıq
    res.json({ 
      message: "Giriş uğurludur!", 
      user: { id: admin.id, username: admin.username } 
    });

  } catch (error) {
    res.status(500).json({ error: "Giriş zamanı server xətası baş verdi." });
  }
});

module.exports = router;
