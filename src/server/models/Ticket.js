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
  
  // Scopes for common queries
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