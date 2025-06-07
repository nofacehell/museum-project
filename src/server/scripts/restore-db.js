import { restoreFromBackup, getAvailableBackups } from './backup-db.js';

async function restoreDatabase() {
  try {
    // Получаем список доступных резервных копий
    const backups = getAvailableBackups();
    
    if (backups.length === 0) {
      console.log('❌ Резервные копии не найдены');
      return;
    }

    // Выводим список доступных резервных копий
    console.log('📋 Доступные резервные копии:');
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup}`);
    });

    // Запрашиваем у пользователя выбор резервной копии
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Введите номер резервной копии для восстановления: ', async (answer) => {
      const index = parseInt(answer) - 1;
      
      if (isNaN(index) || index < 0 || index >= backups.length) {
        console.log('❌ Неверный номер резервной копии');
        rl.close();
        return;
      }

      const backupFile = backups[index];
      
      // Подтверждение восстановления
      rl.question(`Вы уверены, что хотите восстановить базу данных из резервной копии ${backupFile}? (y/n): `, async (confirm) => {
        if (confirm.toLowerCase() === 'y') {
          const success = await restoreFromBackup(backupFile);
          if (success) {
            console.log('✅ База данных успешно восстановлена');
          }
        } else {
          console.log('❌ Восстановление отменено');
        }
        rl.close();
      });
    });
  } catch (error) {
    console.error('❌ Ошибка при восстановлении базы данных:', error.message);
  }
}

// Запускаем процесс восстановления
restoreDatabase(); 