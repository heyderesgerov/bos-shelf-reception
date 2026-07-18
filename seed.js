const db = require('./db');

// İlkin məlumatların bazaya doldurulması (Seed)
try {
  // 1. Nümunə əməkdaşların əlavə edilməsi
  const insertEmployee = db.prepare(`
    INSERT OR IGNORE INTO employees (name, department, room_number, qr_code)
    VALUES (?, ?, ?, ?)
  `);

  insertEmployee.run('Əli Məmmədov', 'İT Sahəsi', 'Otaq 101', 'emp_ali_101');
  insertEmployee.run('Aygün Əliyeva', 'İnsan Resursları', 'Otaq 204', 'emp_aygun_204');
  insertEmployee.run('İlqar Hüseynov', 'Maliyyə', 'Otaq 312', 'emp_ilqar_312');

  // 2. Nümunə görüş otaqlarının əlavə edilməsi
  const insertRoom = db.prepare(`
    INSERT OR IGNORE INTO meeting_rooms (name, floor, status)
    VALUES (?, ?, ?)
  `);

  insertRoom.run('Baku Meeting Room', 1, 'free');
  insertRoom.run('Shusha Conference Hall', 2, 'free');

  // 3. İlkin Admin istifadəçisinin yaradılması
  // Qeyd: Real layihədə şifrə bcrypt ilə şifrələnməlidir, bu ilkin test üçündür
  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO admins (username, password)
    VALUES (?, ?)
  `);
  
  insertAdmin.run('admin', 'admin123');

  console.log("Bazaya ilkin test məlumatları və admin hesabı (admin / admin123) uğurla daxil edildi!");
} catch (error) {
  console.error("Məlumatlar daxil edilərkən xəta baş verdi:", error);
}
