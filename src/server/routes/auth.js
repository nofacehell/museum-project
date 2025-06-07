import express from 'express';
import { User } from '../models/index.js';
import { generateToken, generateRefreshToken, verifyToken, authenticate } from '../utils/auth.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Email и пароль обязательны'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Неверные учетные данные'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_001',
        message: 'Неверные учетные данные'
      });
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
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

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_002',
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        code: 'AUTH_002',
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Create new user
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

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Private
 */
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

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        code: 'AUTH_003',
        message: 'Недействительный refresh token'
      });
    }

    // Find user
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

    // Generate new access token
    const token = generateToken(user);

    // Send response
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

/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate refresh token
 * @access Private
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Clear refresh token
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