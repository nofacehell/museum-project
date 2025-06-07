# Museum Project / Музейный Проект

## English

### Project Overview
This is a museum management system built with React, Express, and SQLite. It provides features for managing museum collections, exhibits, and user interactions.

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- SQLite3

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd museum-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Initialize the database**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Start the backend server**
   In a new terminal window:
   ```bash
   npm run dev:server
   ```

### Available Scripts
- `npm run dev` - Start the frontend development server
- `npm run dev:server` - Start the backend server with nodemon
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run seed` - Initialize the database with sample data
- `npm run backup` - Create a database backup
- `npm run restore` - Restore the database from backup

### Project Structure
- `/src` - Frontend React application
- `/backend` - Backend Express server
- `/db` - Database files
- `/public` - Static assets
- `/uploads` - User uploaded files

## Русский

### Обзор проекта
Это система управления музеем, построенная на React, Express и SQLite. Она предоставляет функции для управления коллекциями музея, экспонатами и взаимодействием с пользователями.

### Требования
- Node.js (версия 16 или выше)
- npm (входит в состав Node.js)
- SQLite3

### Шаги установки (обновлено)

1. **Клонирование репозитория**
   ```bash
   git clone [url-вашего-репозитория]
   cd museum-project
   ```

2. **Установка зависимостей**
   ```bash
   npm install
   ```

3. **Настройка переменных окружения**
   Создайте файл `.env` в корневой директории со следующими переменными:
   ```
   PORT=3000
   JWT_SECRET=ваш-секретный-ключ
   CLOUDINARY_CLOUD_NAME=ваше-облачное-имя
   CLOUDINARY_API_KEY=ваш-api-ключ
   CLOUDINARY_API_SECRET=ваш-api-секрет
   ```

4. **Инициализация базы данных**
   ```bash
   npm run seed
   ```

5. **Запуск фронтенда (отдельное окно терминала)**
   ```bash
   npm run dev
   ```

6. **Запуск бэкенда (отдельное окно терминала)**
   ```bash
   npm run server
   ```

---
### Возможные ошибки и их решение

**1. Ошибка с sqlite3 (например, ...node_sqlite3.node is not a valid Win32 application)**
- Причина: несовместимость версии Node.js и sqlite3, либо отсутствие необходимых build tools.
- Решение:
  - Убедитесь, что у вас установлена Node.js версии 18 или выше (рекомендуется LTS).
  - Удалите и переустановите sqlite3:
    ```bash
    npm uninstall sqlite3
    npm install sqlite3
    ```
  - Если ошибка не исчезла, установите Visual Studio Build Tools (https://visualstudio.microsoft.com/visual-cpp-build-tools/) с компонентом "Desktop development with C++" и повторите установку зависимостей.

**2. Ошибка с bcrypt (например, ...bcrypt_lib.node is not a valid Win32 application)**
- Причина: bcrypt требует компиляции нативных модулей, что может вызвать ошибки на Windows или новых версиях Node.js.
- Решение:
  - Используйте пакет bcryptjs (он уже используется в этом проекте):
    ```bash
    npm uninstall bcrypt
    npm install bcryptjs
    ```
  - Проверьте, что во всех файлах импортируется именно bcryptjs:
    ```js
    import bcrypt from 'bcryptjs';
    ```

**3. Ошибка "MSVS_VERSION not set" или "Could not find any Visual Studio installation to use"**
- Решение: Установите Visual Studio Build Tools с поддержкой C++.

**4. Проблемы с портом (например, порт 3000 уже занят)**
- Решение: Измените переменную PORT в файле .env на другой свободный порт.

**5. Проблемы с правами доступа к файлам**
- Решение: Запускайте терминал от имени администратора.

---
**Если возникли другие ошибки — внимательно читайте сообщения в терминале, они обычно подсказывают, что делать. Если не удаётся решить проблему — обратитесь к разработчику проекта.**

### Available Scripts
- `npm run dev` - Запуск сервера разработки фронтенда
- `npm run dev:server` - Запуск бэкенд-сервера с nodemon
- `npm run build` - Сборка проекта для продакшена
- `npm run preview` - Предпросмотр продакшен-сборки
- `npm run seed` - Инициализация базы данных тестовыми данными
- `npm run backup` - Создание резервной копии базы данных
- `npm run restore` - Восстановление базы данных из резервной копии

### Project Structure
- `/src` - Фронтенд-приложение на React
- `/backend` - Бэкенд-сервер на Express
- `/db` - Файлы базы данных
- `/public` - Статические ресурсы
- `/uploads` - Загруженные пользователями файлы



## Technologies Used
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite with Sequelize
- **Authentication**: JWT
- **Static Assets**: Local storage with fallback mechanism


## License
This project is licensed under the MIT License - see the LICENSE file for details.
