import express from 'express';
import { createBackup, getAvailableBackups, restoreFromBackup } from '../scripts/backup-db.js';

const router = express.Router();

// Создать бэкап
router.post('/backup-db', async (req, res) => {
  const ok = await createBackup();
  if (ok) {
    res.json({ success: true, message: 'Бэкап успешно создан' });
  } else {
    res.status(500).json({ success: false, message: 'Ошибка при создании бэкапа' });
  }
});

// Получить список бэкапов
router.get('/backups', (req, res) => {
  const backups = getAvailableBackups();
  res.json({ backups });
});

// Восстановить из бэкапа
router.post('/restore-db', async (req, res) => {
  const { backupFile } = req.body;
  if (!backupFile) return res.status(400).json({ success: false, message: 'Не указано имя файла бэкапа' });
  const ok = await restoreFromBackup(backupFile);
  if (ok) {
    res.json({ success: true, message: 'База данных восстановлена' });
  } else {
    res.status(500).json({ success: false, message: 'Ошибка при восстановлении базы' });
  }
});

export default router; 