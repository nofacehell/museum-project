# Музейный проект - Листинг кода

## Модели

### User.js
```js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(['visitor', 'admin']),
    defaultValue: 'visitor',
    allowNull: false
  },
  profile: {
    type: DataTypes.JSON,
    defaultValue: {
      phone: null,
      address: null,
      preferences: {
        notifications: true,
        language: 'en'
      }
    }
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
```

### Event.js
```js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(['exhibition', 'workshop', 'special']),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.VIRTUAL,
    get() {
      const now = new Date();
      if (this.startDate > now) return 'upcoming';
      if (this.endDate < now) return 'past';
      return 'ongoing';
    }
  },
  details: {
    type: DataTypes.JSON,
    defaultValue: {
      curator: null,
      capacity: 100,
      price: 0,
      schedule: []
    }
  }
}, {
  timestamps: true,
  
  scopes: {
    upcoming: {
      where: {
        startDate: {
          [sequelize.Sequelize.Op.gt]: new Date()
        }
      }
    },
    ongoing: {
      where: {
        startDate: {
          [sequelize.Sequelize.Op.lte]: new Date()
        },
        endDate: {
          [sequelize.Sequelize.Op.gte]: new Date()
        }
      }
    },
    past: {
      where: {
        endDate: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      }
    }
  }
});

export default Event;
```

### Ticket.js
```js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => `TKT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
  },
  type: {
    type: DataTypes.ENUM(['regular', 'special']),
    allowNull: false,
    defaultValue: 'regular'
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 15.00
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(['available', 'reserved', 'sold', 'used', 'cancelled']),
    defaultValue: 'available',
    allowNull: false
  },
  maxPerPerson: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  available: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.status === 'available';
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visitorInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  
  scopes: {
    available: {
      where: {
        status: 'available'
      }
    },
    active: {
      where: {
        status: ['reserved', 'sold']
      }
    },
    byDate: (date) => ({
      where: {
        date: date
      }
    })
  }
});

export default Ticket;
```

### EventRegistration.js
```js
import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const EventRegistration = sequelize.define('EventRegistration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registrationId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => `REG-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  attendees: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM(['pending', 'confirmed', 'cancelled']),
    defaultValue: 'pending',
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

export default EventRegistration;
```

## Утилиты

### auth.js
```js
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'museum-project-secret-key';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_003',
        message: 'Не авторизован'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_004',
        message: 'Токен истек или недействителен'
      });
    }
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Пользователь не найден'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Ошибка аутентификации'
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      code: 'AUTH_005',
      message: 'Доступ запрещен. Требуются права администратора'
    });
  }
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  authenticate,
  authorizeAdmin
};
```

## Маршруты (Routes)

### auth.js (маршруты)
```js
import express from 'express';
import { User } from '../models/index.js';
import { generateToken, generateRefreshToken, verifyToken, authenticate } from '../utils/auth.js';

const router = express.Router();

// Авторизация пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Email и пароль обязательны'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Неверные учетные данные'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Неверные учетные данные'
      });
    }

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при авторизации'
    });
  }
});

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_002',
        message: 'Все поля обязательны для заполнения'
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_002',
        message: 'Пользователь с таким email уже существует'
      });
    }

    const user = await User.create({
      email,
      password,
      name,
      role: 'visitor'
    });

    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при регистрации'
    });
  }
});

// Обновление токена
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_003',
        message: 'Отсутствует refresh token'
      });
    }

    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_003',
        message: 'Недействительный refresh token'
      });
    }

    const user = await User.findOne({
      where: {
        id: decoded.id,
        refreshToken
      }
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_003',
        message: 'Недействительный refresh token'
      });
    }

    const token = generateToken(user);

    res.json({
      status: 'success',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при обновлении токена'
    });
  }
});

// Выход пользователя
router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.json({
      status: 'success',
      message: 'Выход выполнен успешно'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при выходе'
    });
  }
});

export default router;
```

### users.js (маршруты)
```js
import express from 'express';
import { User, Ticket, EventRegistration, Event } from '../models/index.js';
import { authenticate } from '../utils/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Получение профиля пользователя
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'USR_001',
        message: 'Пользователь не найден'
      });
    }

    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении профиля'
    });
  }
});

// Обновление профиля пользователя
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, profile } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'USR_001',
        message: 'Пользователь не найден'
      });
    }

    if (name) user.name = name;
    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile
      };
    }

    await user.save();

    const updatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
      updatedAt: user.updatedAt
    };

    res.json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при обновлении профиля'
    });
  }
});

// Изменение пароля
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: 'USR_001',
        message: 'Пользователь не найден'
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        code: 'USR_003',
        message: 'Текущий пароль указан неверно'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        code: 'USR_004',
        message: 'Новый пароль слишком слабый (минимум 6 символов)'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Пароль успешно обновлен'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при изменении пароля'
    });
  }
});

export default router;
```

## Конфигурация сервера

### server.js
```js
// server/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import winston from 'winston';

import { connectDB } from './config/sequelize.js';
import { seedDatabase } from './models/index.js';

import exhibitsRouter   from './routes/exhibits.js';
import quizzesRouter    from './routes/quizzes.js';
import gamesRouter      from './routes/games.js';
import reviewsRouter    from './routes/reviews.js';
import categoriesRouter from './routes/categories.js';
import authRouter       from './routes/auth.js';
import usersRouter      from './routes/users.js';
import ticketsRouter    from './routes/tickets.js';
import eventsRouter     from './routes/events.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Локальное хранилище для резервного копирования
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const localDB = {
  getAll: col => {
    const f = path.join(DATA_DIR, `${col}.json`);
    return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  },
  save: (col, data) => {
    const f = path.join(DATA_DIR, `${col}.json`);
    fs.writeFileSync(f, JSON.stringify(data, null, 2));
  }
};

app.use((req, _, next) => {
  req.dbConnected = true;
  req.localDB     = localDB;
  next();
});

// Маршруты API
app.use('/api/exhibits',   exhibitsRouter);
app.use('/api/quizzes',    quizzesRouter);
app.use('/api/games',      gamesRouter);
app.use('/api/reviews',    reviewsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth',       authRouter);
app.use('/api/users',      usersRouter);
app.use('/api/tickets',    ticketsRouter);
app.use('/api/events',     eventsRouter);

// Обработчик ошибок
app.use((err, _, res, __) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// Запуск сервера
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;
``` 