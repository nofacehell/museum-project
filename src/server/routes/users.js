import express from 'express';
import { User, Ticket, EventRegistration, Event } from '../models/index.js';
import { authenticate } from '../utils/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
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

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
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

    // Update user fields
    if (name) user.name = name;
    if (profile) {
      // Merge existing profile with new profile data
      user.profile = {
        ...user.profile,
        ...profile
      };
    }

    // Save changes
    await user.save();

    // Return updated user without sensitive information
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

/**
 * @route GET /api/users/tickets
 * @desc Get user tickets
 * @access Private
 */
router.get('/tickets', authenticate, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = { userId: req.user.id };

    // Apply filters if provided
    if (status) where.status = status;
    if (startDate) where.date = { [sequelize.Sequelize.Op.gte]: startDate };
    if (endDate && startDate) {
      where.date = {
        [sequelize.Sequelize.Op.between]: [startDate, endDate]
      };
    } else if (endDate) {
      where.date = { [sequelize.Sequelize.Op.lte]: endDate };
    }

    const tickets = await Ticket.findAll({
      where,
      order: [['date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        tickets,
        total: tickets.length
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении билетов'
    });
  }
});

/**
 * @route GET /api/users/registrations
 * @desc Get user event registrations
 * @access Private
 */
router.get('/registrations', authenticate, async (req, res) => {
  try {
    const registrations = await EventRegistration.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Event,
        attributes: ['id', 'title', 'startDate', 'endDate', 'location']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Format the registrations to match API documentation
    const formattedRegistrations = registrations.map(reg => ({
      id: reg.registrationId,
      eventId: reg.eventId,
      eventTitle: reg.Event.title,
      date: reg.Event.startDate,
      status: reg.status,
      attendees: reg.attendees
    }));

    res.json({
      status: 'success',
      data: {
        registrations: formattedRegistrations,
        total: formattedRegistrations.length
      }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении регистраций'
    });
  }
});

/**
 * @route PUT /api/users/password
 * @desc Change user password
 * @access Private
 */
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

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        code: 'USR_003',
        message: 'Текущий пароль указан неверно'
      });
    }

    // Check if new password is strong enough
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        code: 'USR_004',
        message: 'Новый пароль слишком слабый (минимум 6 символов)'
      });
    }

    // Update password
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