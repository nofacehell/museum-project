import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к файлам
const dbPath = path.resolve(__dirname, '../database.sqlite');
const backupsDir = path.resolve(__dirname, '../backups');

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/backup.log' })
  ]
});

// Функция для создания резервной копии
async function createBackup() {
  try {
    // Проверяем существование директории для бэкапов
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Создаем имя файла с текущей датой и временем
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const backupFileName = `museum-backup-${timestamp}.sqlite`;
    const backupPath = path.join(backupsDir, backupFileName);

    // Копируем файл базы данных
    fs.copyFileSync(dbPath, backupPath);

    // Логируем успешное создание бэкапа
    logger.info('Backup created successfully', {
      backupFile: backupFileName,
      size: fs.statSync(backupPath).size
    });

    // Удаляем старые бэкапы (оставляем только последние 5)
    const backups = fs.readdirSync(backupsDir)
      .filter(file => file.startsWith('museum-backup-'))
      .sort()
      .reverse();

    if (backups.length > 5) {
      const oldBackups = backups.slice(5);
      oldBackups.forEach(file => {
        fs.unlinkSync(path.join(backupsDir, file));
        logger.info('Old backup deleted', { file });
      });
    }

    console.log(`✅ Резервная копия создана: ${backupFileName}`);
    return true;
  } catch (error) {
    logger.error('Backup failed', { error: error.message });
    console.error('❌ Ошибка при создании резервной копии:', error.message);
    return false;
  }
}

// Функция для восстановления из резервной копии
async function restoreFromBackup(backupFileName) {
  try {
    const backupPath = path.join(backupsDir, backupFileName);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Резервная копия не найдена');
    }

    // Создаем резервную копию текущей базы данных перед восстановлением
    const currentBackupName = `museum-pre-restore-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`;
    fs.copyFileSync(dbPath, path.join(backupsDir, currentBackupName));

    // Восстанавливаем из резервной копии
    fs.copyFileSync(backupPath, dbPath);

    logger.info('Database restored successfully', { backupFile: backupFileName });
    console.log(`✅ База данных восстановлена из резервной копии: ${backupFileName}`);
    return true;
  } catch (error) {
    logger.error('Restore failed', { error: error.message });
    console.error('❌ Ошибка при восстановлении базы данных:', error.message);
    return false;
  }
}

// Функция для получения списка доступных резервных копий
function getAvailableBackups() {
  try {
    return fs.readdirSync(backupsDir)
      .filter(file => file.startsWith('museum-backup-'))
      .sort()
      .reverse();
  } catch (error) {
    logger.error('Failed to get backup list', { error: error.message });
    return [];
  }
}

export { createBackup, restoreFromBackup, getAvailableBackups }; 