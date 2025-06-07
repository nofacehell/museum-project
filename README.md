
# 🎨 Museum Project / Музейный Проект

Система управления музеем, построенная с использованием **React**, **Express** и **SQLite**. Позволяет управлять коллекциями, экспонатами и взаимодействовать с пользователями.

---

## 🚀 Обзор

**Museum Project** — это удобная платформа для музеев, обеспечивающая:
- Управление экспонатами и коллекциями
- Загрузку медиафайлов
- Аутентификацию пользователей
- Интуитивно понятный интерфейс

---

## 📦 Требования

- [Node.js](https://nodejs.org/) v16 или выше
- npm (входит в Node.js)
- SQLite3

---

## ⚙️ Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/your-username/museum-project.git
   cd museum-project

2. **Установите зависимости**

   ```bash
   npm install
   ```

3. **Создайте `.env` файл**
   В корневом каталоге создайте файл `.env` со следующим содержанием:

   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Инициализируйте базу данных**

   ```bash
   npm run seed
   ```

5. **Запуск проекта**

   * Фронтенд:

     ```bash
     npm run dev
     ```
   * Бэкенд:

     ```bash
     npm run server
     ```

---

## ❗ Возможные ошибки и их решение

### 1. `sqlite3.node is not a valid Win32 application`

> **Причина**: несовместимость версий
> **Решение**:

```bash
npm uninstall sqlite3
npm install sqlite3
```

Убедитесь в наличии Visual Studio Build Tools: [Скачать](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

---

### 2. `bcrypt_lib.node is not a valid Win32 application`

> **Причина**: Ошибки при компиляции `bcrypt`
> **Решение**:

```bash
npm uninstall bcrypt
npm install bcryptjs
```

И используйте:

```js
import bcrypt from 'bcryptjs';
```

---

### 3. `MSVS_VERSION not set` или `Could not find any Visual Studio installation`

> Установите **Visual Studio Build Tools** с поддержкой C++.

---

### 4. `Port 3000 is already in use`

> Измените порт в `.env` файле:

```env
PORT=3001
```

---

### 5. Ошибки доступа к файлам

> Запустите терминал от имени администратора.

---

## 📜 Доступные скрипты

| Скрипт               | Назначение                                  |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Запуск фронтенда                            |
| `npm run server`     | Запуск бэкенда                              |
| `npm run dev:server` | Запуск бэкенда с `nodemon`                  |
| `npm run build`      | Сборка фронтенда для продакшена             |
| `npm run preview`    | Предпросмотр продакшен-сборки               |
| `npm run seed`       | Инициализация базы данных тестовыми данными |
| `npm run backup`     | Резервное копирование базы данных           |
| `npm run restore`    | Восстановление базы из резервной копии      |

---

## 🗂 Структура проекта

```
museum-project/
├── backend/        # Сервер на Express
├── db/             # SQLite база данных
├── public/         # Статические ресурсы
├── src/            # React фронтенд
├── uploads/        # Загружаемые пользователями файлы
├── .env            # Переменные окружения
└── package.json
```

---

## 🛠 Используемые технологии

* **Frontend**: React + Vite
* **Backend**: Node.js, Express
* **База данных**: SQLite + Sequelize
* **Аутентификация**: JWT
* **Файлы**: Cloudinary и локальное хранилище

---

## 📄 License

Этот проект лицензирован под лицензией MIT. Подробнее см. в [LICENSE](./LICENSE).

---

