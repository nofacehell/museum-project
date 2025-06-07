import sequelize from '../config/sequelize.js';
import { Review } from '../models/index.js';
import { seedReviews } from '../models/Review.js';

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');
    
    // Disable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = OFF');
    
    // Drop all tables
    await sequelize.query('DROP TABLE IF EXISTS reviews');
    await sequelize.query('DROP TABLE IF EXISTS exhibits');
    
    // Re-enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    // Force sync all models (this will recreate tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database schema reset successfully');
    
    // Wait a bit to ensure tables are created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Seed the reviews
    await seedReviews(true);
    console.log('✅ Database seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Ensure all models are initialized before running
Promise.all([
  Review.sync({ force: true })
]).then(() => {
  resetDatabase();
}).catch(error => {
  console.error('❌ Error initializing models:', error);
  process.exit(1);
}); 