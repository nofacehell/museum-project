import express from 'express';
import { Ticket, User } from '../models/index.js';
import { authenticate } from '../utils/auth.js';
import sequelize from '../config/sequelize.js';

const router = express.Router();

/**
 * @route GET /api/tickets
 * @desc Get available tickets
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { date, type, status } = req.query;
    const where = {};

    // Apply filters if provided
    if (date) where.date = date;
    if (type) where.type = type;
    if (status === 'available') where.status = 'available';
    else if (status === 'sold-out') where.status = { [sequelize.Sequelize.Op.ne]: 'available' };

    const tickets = await Ticket.findAll({
      where,
      attributes: ['id', 'ticketId', 'type', 'price', 'date', 'status', 'maxPerPerson', 'available'],
      order: [['date', 'ASC']]
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
 * @route POST /api/tickets/purchase
 * @desc Purchase tickets
 * @access Private
 */
router.post('/purchase', authenticate, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { ticketId, quantity, visitorInfo } = req.body;

    // Validate input
    if (!ticketId || !quantity || !visitorInfo) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'TKT_002',
        message: 'Все поля обязательны для заполнения'
      });
    }

    // Find ticket template
    const ticketTemplate = await Ticket.findOne({
      where: {
        id: ticketId,
        status: 'available'
      }
    });

    if (!ticketTemplate) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        code: 'TKT_001',
        message: 'Билет не найден или недоступен'
      });
    }

    // Check if quantity is valid
    if (quantity <= 0 || quantity > ticketTemplate.maxPerPerson) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        code: 'TKT_003',
        message: `Допустимое количество билетов: от 1 до ${ticketTemplate.maxPerPerson}`
      });
    }

    // Generate order ID
    const orderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // Create purchased tickets
    const purchasedTickets = [];
    for (let i = 0; i < quantity; i++) {
      // Generate QR code (in production, use a proper QR code generation library)
      const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDSbgAAcXGpDUAAAAASUVORK5CYII=`;

      const newTicket = await Ticket.create({
        type: ticketTemplate.type,
        price: ticketTemplate.price,
        date: ticketTemplate.date,
        status: 'sold',
        userId: req.user.id,
        orderId,
        visitorInfo,
        qrCode,
        purchaseDate: new Date()
      }, { transaction });

      purchasedTickets.push({
        id: newTicket.ticketId,
        type: newTicket.type,
        price: newTicket.price,
        date: newTicket.date,
        qrCode: newTicket.qrCode
      });
    }

    await transaction.commit();

    // Calculate total amount
    const totalAmount = ticketTemplate.price * quantity;

    res.json({
      status: 'success',
      data: {
        orderId,
        tickets: purchasedTickets,
        totalAmount,
        paymentStatus: 'completed'
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Purchase ticket error:', error);
    res.status(500).json({
      status: 'error',
      code: 'TKT_004',
      message: 'Ошибка сервера при покупке билета'
    });
  }
});

/**
 * @route GET /api/tickets/:ticketId
 * @desc Get ticket details
 * @access Private
 */
router.get('/:ticketId', authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({
      where: {
        ticketId,
        userId: req.user.id
      }
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        code: 'TKT_001',
        message: 'Билет не найден'
      });
    }

    res.json({
      status: 'success',
      data: {
        id: ticket.ticketId,
        type: ticket.type,
        price: ticket.price,
        date: ticket.date,
        visitorInfo: ticket.visitorInfo,
        qrCode: ticket.qrCode,
        status: ticket.status,
        purchaseDate: ticket.purchaseDate
      }
    });
  } catch (error) {
    console.error('Get ticket details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении информации о билете'
    });
  }
});

/**
 * @route POST /api/tickets/:ticketId/cancel
 * @desc Cancel ticket
 * @access Private
 */
router.post('/:ticketId/cancel', authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({
      where: {
        ticketId,
        userId: req.user.id
      }
    });

    if (!ticket) {
      return res.status(404).json({
        status: 'error',
        code: 'TKT_001',
        message: 'Билет не найден'
      });
    }

    // Check if ticket is already cancelled
    if (ticket.status === 'cancelled') {
      return res.status(400).json({
        status: 'error',
        code: 'TKT_005',
        message: 'Билет уже отменен'
      });
    }

    // Check if ticket is already used
    if (ticket.status === 'used') {
      return res.status(400).json({
        status: 'error',
        code: 'TKT_005',
        message: 'Нельзя отменить использованный билет'
      });
    }

    // Check if cancellation period is expired
    const ticketDate = new Date(ticket.date);
    const now = new Date();
    const hoursDiff = (ticketDate - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({
        status: 'error',
        code: 'TKT_006',
        message: 'Период отмены истек. Билеты можно отменить не менее чем за 24 часа до события'
      });
    }

    // Cancel ticket
    ticket.status = 'cancelled';
    await ticket.save();

    // In a real application, process refund here

    res.json({
      status: 'success',
      data: {
        ticketId: ticket.ticketId,
        refundAmount: ticket.price,
        status: 'cancelled'
      }
    });
  } catch (error) {
    console.error('Cancel ticket error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при отмене билета'
    });
  }
});

export default router; 