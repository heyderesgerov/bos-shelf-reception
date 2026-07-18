const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Sadə yoxlama servisi
app.get('/', (req, res) => {
    res.send('<h1>BOS Shelf Resepsiyon Sistemi Aktivdir!</h1><p>Məlumatlar tezliklə admin paneldən idarə olunacaq.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir`));
