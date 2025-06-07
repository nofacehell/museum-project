import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Middleware для обработки ошибок при загрузке изображений
 * Если изображение не найдено, отправляет изображение-заполнитель
 */
export const handleImageError = (req, res, next) => {
  const imagePlaceholder = path.join(__dirname, '../../../uploads/placeholder.svg');
  
  // Сохраняем оригинальный метод sendFile
  const originalSendFile = res.sendFile;
  
  // Переопределяем метод sendFile для обработки ошибок
  res.sendFile = function(originalPath, options, callback) {
    // Проверяем существование файла перед отправкой
    fs.access(originalPath, fs.constants.F_OK, (err) => {
      if (err) {
        // Если файл не существует, отправляем изображение-заполнитель
        console.log(`Файл не найден: ${originalPath}, используем заполнитель`);
        return originalSendFile.call(this, imagePlaceholder, options, callback);
      }
      
      // Если файл существует, отправляем его
      return originalSendFile.call(this, originalPath, options, callback);
    });
  };
  
  next();
};

/**
 * Функция для форматирования URL изображения
 * Добавляет базовый URL, если он отсутствует
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/api/uploads/')) {
    return `/api/uploads/${imageUrl}`;
  }
  
  return imageUrl;
};

export default {
  handleImageError,
  formatImageUrl
}; 