import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Создает простое изображение-заполнитель SVG в виде строки
 */
export const createPlaceholderSVG = (width = 400, height = 300, text = 'Изображение отсутствует') => {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <rect width="100%" height="100%" fill="none" stroke="#cccccc" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Arial" font-size="20" text-anchor="middle" fill="#888888">${text}</text>
      <text x="50%" y="58%" font-family="Arial" font-size="14" text-anchor="middle" fill="#888888">Museum Project</text>
    </svg>
  `;
};

/**
 * Создает PNG заполнитель из SVG
 */
export const createPlaceholderImage = () => {
  const svgContent = createPlaceholderSVG();
  const placeholderPath = path.join(__dirname, '../../../uploads/placeholder.svg');
  
  fs.writeFileSync(placeholderPath, svgContent, 'utf8');
  console.log(`Изображение-заполнитель создано: ${placeholderPath}`);
  
  return placeholderPath;
};

export default createPlaceholderImage; 