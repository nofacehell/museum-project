import { createBackup } from './backup-db.js';

// Функция для автоматического создания резервных копий
export async function startAutoBackup() {
  console.log('🚀 Запуск автоматического резервного копирования...');
  
  // Создаем первую резервную копию сразу
  await createBackup();
  
  // Устанавливаем интервал для создания резервных копий (каждые 24 часа)
  setInterval(async () => {
    await createBackup();
  }, 24 * 60 * 60 * 1000); // 24 часа в миллисекундах
}

// Если скрипт запущен напрямую (не импортирован)
if (process.argv[1] === import.meta.url) {
  startAutoBackup().catch(error => {
    console.error('❌ Ошибка при запуске автоматического резервного копирования:', error);
  });
} 