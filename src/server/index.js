const express = require('express');
const cors = require('cors');
const path = require('path');
const exhibitsRouter = require('./routes/exhibits');
const categoriesRouter = require('./routes/categories');
const initializeDatabase = require('./config/init-db');
const adminBackupRouter = require('./routes/admin-backup.js');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/exhibits', exhibitsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin', adminBackupRouter);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();