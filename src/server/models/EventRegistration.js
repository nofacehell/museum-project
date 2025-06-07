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