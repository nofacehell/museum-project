import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Use a secret from environment variables or a default one (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'museum-project-secret-key';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

/**
 * Generate JWT access token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
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

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token or null
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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
    
    // Add user to request object
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

/**
 * Admin authorization middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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