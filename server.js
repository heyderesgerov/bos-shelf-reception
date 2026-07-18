const express = require('express');
const path = require('path');
const db = require('./db'); // Verilənlər bazası bağlantısı

// Marşrutların (Routes) daxil edilməsi
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Gələn JSON və URL-encoded dataları oxumaq üçün middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik frontend fayllarını (HTML, CSS, JS) paylaşıma açırıq
app.use(express.static(path.join(__dirname, 'public', 'public')));

// API Marşrutlarının proqrama tanıdılması
app.use('/api', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Hər hansı digər sorğuda əsas ana səhifəni (index.html) qaytarırıq
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'public', 'index.html'));
});

// Serverin başladılması
app.listen(PORT, () => {
  console.log(`Serverimiz ${PORT} portunda uğurla işə düşdü!`);
});
