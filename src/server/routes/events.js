import express from 'express';
import { Event, EventRegistration, User } from '../models/index.js';
import { authenticate, authorizeAdmin } from '../utils/auth.js';
import sequelize from '../config/sequelize.js';

const router = express.Router();

/**
 * @route GET /api/events
 * @desc Get all events
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, type, status } = req.query;
    let scope = null;

    // Apply status filter if provided
    if (status === 'upcoming') {
      scope = 'upcoming';
    } else if (status === 'ongoing') {
      scope = 'ongoing';
    } else if (status === 'past') {
      scope = 'past';
    }

    // Construct the where clause
    const where = {};

    // Apply additional filters if provided
    if (type) where.type = type;
    if (startDate) where.startDate = { [sequelize.Sequelize.Op.gte]: startDate };
    if (endDate) {
      if (startDate) {
        where.startDate = {
          [sequelize.Sequelize.Op.between]: [startDate, endDate]
        };
      } else {
        where.startDate = { [sequelize.Sequelize.Op.lte]: endDate };
      }
    }

    // Get events with the appropriate scope
    let events;
    if (scope) {
      events = await Event.scope(scope).findAll({
        where,
        order: [['startDate', 'ASC']]
      });
    } else {
      events = await Event.findAll({
        where,
        order: [['startDate', 'ASC']]
      });
    }

    res.json({
      status: 'success',
      data: {
        events,
        total: events.length
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении событий'
    });
  }
});

/**
 * @route GET /api/events/:id
 * @desc Get event details
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        code: 'EVT_001',
        message: 'Событие не найдено'
      });
    }

    res.json({
      status: 'success',
      data: event
    });
  } catch (error) {
    console.error('Get event details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении информации о событии'
    });
  }
});

/**
 * @route POST /api/events/:id/register
 * @desc Register for event
 * @access Private
 */
router.post('/:id/register', authenticate, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { ticketQuantity, attendees } = req.body;

    // Validate input
    if (!ticketQuantity || !attendees || !Array.isArray(attendees) || attendees.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'EVT_004',
        message: 'Количество билетов и участники обязательны'
      });
    }

    // Find event
    const event = await Event.findByPk(id);

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        code: 'EVT_001',
        message: 'Событие не найдено'
      });
    }

    // Check if event is in the future
    const now = new Date();
    if (new Date(event.startDate) < now) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'EVT_002',
        message: 'Регистрация на это событие закрыта'
      });
    }

    // Check if event has capacity
    const existingRegistrations = await EventRegistration.findAll({
      where: { eventId: id }
    });

    const currentRegistrations = existingRegistrations.reduce((total, reg) => 
      total + reg.attendees.length, 0);

    if (currentRegistrations + attendees.length > event.details.capacity) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'EVT_003',
        message: 'Достигнут лимит участников события'
      });
    }

    // Check if user already registered for this event
    const existingUserRegistration = await EventRegistration.findOne({
      where: {
        eventId: id,
        userId: req.user.id
      }
    });

    if (existingUserRegistration) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'EVT_006',
        message: 'Вы уже зарегистрированы на это событие'
      });
    }

    // Generate ticket IDs for attendees
    const attendeesWithTickets = attendees.map(attendee => ({
      ...attendee,
      ticketId: `TKT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
    }));

    // Create registration
    const registration = await EventRegistration.create({
      eventId: id,
      userId: req.user.id,
      attendees: attendeesWithTickets,
      status: 'confirmed',
      totalAmount: event.details.price * ticketQuantity
    }, { transaction });

    await transaction.commit();

    res.json({
      status: 'success',
      data: {
        registrationId: registration.registrationId,
        eventId: id,
        attendees: attendeesWithTickets,
        totalAmount: event.details.price * ticketQuantity,
        status: 'confirmed'
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Event registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при регистрации на событие'
    });
  }
});

/**
 * @route GET /api/events/:id/registrations
 * @desc Get event registrations (Admin only)
 * @access Private
 */
router.get('/:id/registrations', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        code: 'EVT_001',
        message: 'Событие не найдено'
      });
    }

    // Get registrations
    const registrations = await EventRegistration.findAll({
      where: { eventId: id },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Format data
    const formattedRegistrations = registrations.map(reg => ({
      registrationId: reg.registrationId,
      userId: reg.userId,
      attendees: reg.attendees,
      registrationDate: reg.registrationDate,
      status: reg.status
    }));

    res.json({
      status: 'success',
      data: {
        eventId: id,
        registrations: formattedRegistrations,
        total: formattedRegistrations.length
      }
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении регистраций'
    });
  }
});

/**
 * @route POST /api/events
 * @desc Create new event (Admin only)
 * @access Private
 */
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const {
      title, description, type, startDate, endDate, location, imageUrl, details
    } = req.body;

    // Validate input
    if (!title || !description || !type || !startDate || !endDate || !location) {
      return res.status(400).json({
        status: 'error',
        message: 'Все обязательные поля должны быть заполнены'
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      imageUrl,
      details: details || undefined
    });

    res.status(201).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при создании события'
    });
  }
});

export default router; 