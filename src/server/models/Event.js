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
  
  // Custom method to get events by status
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