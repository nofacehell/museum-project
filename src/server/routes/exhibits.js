import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Exhibit } from '../models/index.js';
import { generateCategoryIcon } from '../utils/iconHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists in project root
const uploadsDir = path.join(__dirname, '../../../uploads/exhibits');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Только изображения разрешены к загрузке!"));
  }
});

// GET all exhibits
router.get('/', async (req, res) => {
  try {
    let exhibits;
    
    if (req.dbConnected) {
      exhibits = await Exhibit.findAll({
        order: [['createdAt', 'DESC']]
      });
    } else {
      exhibits = req.localDB.getAll('exhibits');
    }
    
    res.json(exhibits);
  } catch (error) {
    console.error('Error getting exhibits:', error);
    res.status(500).json({ message: 'Ошибка при получении экспонатов', error: error.message });
  }
});

// GET featured exhibits
router.get('/featured', async (req, res) => {
  try {
    let exhibits;
    
    if (req.dbConnected) {
      exhibits = await Exhibit.findAll({
        where: { featured: true },
        limit: 3
      });
    } else {
      exhibits = req.localDB.getAll('exhibits').filter(e => e.featured).slice(0, 3);
    }
    
    res.json(exhibits);
  } catch (error) {
    console.error('Error getting featured exhibits:', error);
    res.status(500).json({ message: 'Ошибка при получении избранных экспонатов', error: error.message });
  }
});

// GET exhibits by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let exhibits;
    
    if (req.dbConnected) {
      exhibits = await Exhibit.findAll({
        where: { category }
      });
    } else {
      exhibits = req.localDB.getAll('exhibits').filter(e => e.category === category);
    }
    
    res.json(exhibits);
  } catch (error) {
    console.error('Error getting exhibits by category:', error);
    res.status(500).json({ message: 'Ошибка при получении экспонатов по категории', error: error.message });
  }
});

// GET exhibit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let exhibit;
    
    if (req.dbConnected) {
      exhibit = await Exhibit.findByPk(id);
    } else {
      exhibit = req.localDB.getAll('exhibits').find(e => e._id === id || e.id === id);
    }
    
    if (!exhibit) {
      return res.status(404).json({ message: 'Экспонат не найден' });
    }
    
    res.json(exhibit);
  } catch (error) {
    console.error('Error getting exhibit by ID:', error);
    res.status(500).json({ message: 'Ошибка при получении экспоната', error: error.message });
  }
});

// POST create new exhibit
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /exhibits - Request body:', req.body);
    console.log('POST /exhibits - Uploaded file:', req.file);
    
    const {
      title,
      description,
      category,
      year,
      manufacturer,
      technicalSpecs,
      historicalContext,
      interestingFacts,
      additionalImages
    } = req.body;

    // Process the uploaded image
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/exhibits/${req.file.filename}`;
      console.log('Image uploaded successfully. Path:', imagePath);
      console.log('Full file path:', req.file.path);
    } else {
      console.log('No image file uploaded');
    }

    const newExhibit = {
      _id: uuidv4(),
      title,
      description,
      category,
      image: imagePath,
      year: parseInt(year),
      manufacturer,
      technicalSpecs: JSON.parse(technicalSpecs || '{}'),
      historicalContext,
      interestingFacts: JSON.parse(interestingFacts || '[]'),
      additionalImages: JSON.parse(additionalImages || '[]'),
      categoryIcon: generateCategoryIcon(category),
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating new exhibit with data:', newExhibit);

    let result;
    if (req.dbConnected) {
      result = await Exhibit.create(newExhibit);
    } else {
      const exhibits = req.localDB.getAll('exhibits');
      exhibits.push(newExhibit);
      req.localDB.save('exhibits', exhibits);
      result = newExhibit;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating exhibit:', error);
    res.status(500).json({ message: 'Ошибка при создании экспоната', error: error.message });
  }
});

// PUT update exhibit
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Process the uploaded image if exists
    if (req.file) {
      updateData.image = `/uploads/exhibits/${req.file.filename}`;
      console.log('New image uploaded:', updateData.image);
    } else {
      console.log('No new image uploaded, keeping existing image');
    }

    // Parse JSON strings if provided
    if (updateData.technicalSpecs) {
      updateData.technicalSpecs = JSON.parse(updateData.technicalSpecs);
    }
    if (updateData.interestingFacts) {
      updateData.interestingFacts = JSON.parse(updateData.interestingFacts);
    }
    if (updateData.additionalImages) {
      updateData.additionalImages = JSON.parse(updateData.additionalImages);
    }

    updateData.updatedAt = new Date();

    console.log('Updating exhibit with data:', updateData);

    let updatedExhibit;
    if (req.dbConnected) {
      updatedExhibit = await Exhibit.findByPk(id);
      if (updatedExhibit) {
        await updatedExhibit.update(updateData);
      }
    } else {
      const exhibits = req.localDB.getAll('exhibits');
      const index = exhibits.findIndex(e => e._id === id || e.id === id);
      
      if (index === -1) {
        return res.status(404).json({ message: 'Экспонат не найден' });
      }
      
      exhibits[index] = { ...exhibits[index], ...updateData };
      req.localDB.save('exhibits', exhibits);
      updatedExhibit = exhibits[index];
    }

    if (!updatedExhibit) {
      return res.status(404).json({ message: 'Экспонат не найден' });
    }

    res.json(updatedExhibit);
  } catch (error) {
    console.error('Error updating exhibit:', error);
    res.status(500).json({ message: 'Ошибка при обновлении экспоната', error: error.message });
  }
});

// DELETE exhibit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.dbConnected) {
      // First find the exhibit to check if it exists
      const exhibit = await Exhibit.findByPk(id);
      
      if (!exhibit) {
        return res.status(404).json({ message: 'Экспонат не найден' });
      }
      
      // Then destroy it
      await exhibit.destroy();
    } else {
      const exhibits = req.localDB.getAll('exhibits');
      const index = exhibits.findIndex(e => e._id === id || e.id === id);
      
      if (index === -1) {
        return res.status(404).json({ message: 'Экспонат не найден' });
      }
      
      exhibits.splice(index, 1);
      req.localDB.save('exhibits', exhibits);
    }

    res.json({ message: 'Экспонат успешно удален' });
  } catch (error) {
    console.error('Error deleting exhibit:', error);
    res.status(500).json({ message: 'Ошибка при удалении экспоната', error: error.message });
  }
});

export { router }; 