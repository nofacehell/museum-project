import { migrateExhibits } from '../models/Exhibit.js';
import sequelize from '../config/sequelize.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connection established.');
    await migrateExhibits();
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
})(); 