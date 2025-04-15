import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для сохранения base64 изображения
export const saveBase64Image = async (base64String, folder = 'reviews') => {
  try {
    // Проверяем, что это действительно base64 изображение
    if (!base64String.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    // Извлекаем формат и данные изображения
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const imageType = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');

    // Создаем директорию для загрузок, если её нет
    const uploadDir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${imageType}`;
    const filePath = path.join(uploadDir, fileName);

    // Сохраняем файл
    await fs.promises.writeFile(filePath, buffer);

    // Возвращаем относительный путь к файлу для сохранения в БД
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw error;
  }
};

// Функция для обработки массива изображений
export const processImages = async (images) => {
  if (!images || !Array.isArray(images)) {
    return [];
  }

  const processedImages = [];
  
  for (const image of images) {
    try {
      if (typeof image === 'string') {
        if (image.startsWith('data:image/')) {
          // Если это base64, сохраняем как файл
          const savedPath = await saveBase64Image(image);
          processedImages.push(savedPath);
        } else if (image.startsWith('http') || image.startsWith('/uploads/')) {
          // Если это URL или уже сохраненный путь, оставляем как есть
          processedImages.push(image);
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  return processedImages;
}; 