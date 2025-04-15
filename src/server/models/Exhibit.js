import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

// Модель экспоната
const Exhibit = sequelize.define('Exhibit', {
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
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  historicalContext: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  technicalSpecs: {
    type: DataTypes.TEXT, // Будем хранить JSON в текстовом виде
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('technicalSpecs');
      return rawValue ? JSON.parse(rawValue) : {};
    },
    set(value) {
      this.setDataValue('technicalSpecs', JSON.stringify(value));
    }
  },
  additionalImages: {
    type: DataTypes.TEXT, // Будем хранить массив URL в текстовом виде
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('additionalImages');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('additionalImages', JSON.stringify(value));
    }
  }
}, {
  timestamps: true, // Добавляет createdAt и updatedAt
  tableName: 'exhibits'
});

// Хук, который будет вызван перед получением данных из БД
Exhibit.beforeFind(options => {
  // Ничего не делаем, просто для демонстрации
});

// Хук, который будет вызван перед сохранением
Exhibit.beforeCreate(async (exhibit) => {
  // Проверяем, что у экспоната есть картинка
  if (!exhibit.image) {
    exhibit.image = 'https://via.placeholder.com/300x200?text=No+Image';
  }
});

// Добавляем тестовые данные, если указан флаг
const defaultExhibits = [
  {
    title: "Apple Macintosh",
    category: "Компьютеры",
    description: "Первый массовый персональный компьютер с графическим интерфейсом, выпущенный в 1984 году. Macintosh произвел революцию в компьютерной индустрии, представив дружественный к пользователю интерфейс и мышь как стандартное устройство ввода. Его выпуск был ознаменован знаменитой рекламой '1984', снятой режиссером Ридли Скоттом.",
    shortDescription: "Первый массовый персональный компьютер с графическим интерфейсом, выпущенный в 1984 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Macintosh_128k_transparency.png/800px-Macintosh_128k_transparency.png",
    year: "1984",
    manufacturer: "Apple Inc.",
    technicalSpecs: {
      "Процессор": "Motorola 68000 @ 8 МГц",
      "Память": "128 КБ RAM",
      "Хранение": "400 КБ 3.5\" дисковод",
      "Экран": "9-дюймовый 512x342 монохромный"
    },
    historicalContext: "Macintosh был представлен во время переломного периода в истории персональных компьютеров. Это был первый коммерчески успешный персональный компьютер с графическим интерфейсом и мышью. Эти инновации сделали компьютеры намного более доступными для обычных пользователей, что привело к широкому распространению домашних компьютеров в 1980-х и 1990-х годах.",
    featured: true
  },
  {
    title: "Sony Walkman TPS-L2",
    category: "Аудиотехника",
    description: "Первый в мире портативный аудиоплеер, выпущенный в 1979 году, революционизировал способ, которым люди слушают музыку. Компактный Walkman позволил людям брать свою музыку с собой куда угодно, что сделало музыку более персональной и портативной. Модель TPS-L2 была первой в огромной линейке устройств Walkman, которые производились до 2010 года.",
    shortDescription: "Первый в мире портативный аудиоплеер, изменивший способ прослушивания музыки, выпущенный в 1979 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Original_Sony_Walkman_TPS-L2.JPG/800px-Original_Sony_Walkman_TPS-L2.JPG",
    year: "1979",
    manufacturer: "Sony Corporation",
    technicalSpecs: {
      "Тип носителя": "Компакт-кассета",
      "Батарея": "2 x AA батареи",
      "Функции": "Воспроизведение, перемотка, функция 'горячая линия' (микрофон)",
      "Разъемы": "Два 3.5 мм аудиовыхода"
    },
    historicalContext: "До появления Walkman, портативные музыкальные устройства были громоздкими и неудобными. Sony Walkman изменил культуру потребления музыки, сделав ее действительно личным опытом. Это устройство создало новый рынок портативной электроники и заложило основу для будущих устройств, таких как Discman, MP3-плееры и в конечном итоге смартфоны с функциями музыкальных плееров.",
    featured: true
  },
  {
    title: "Nokia 3310",
    category: "Мобильные устройства",
    description: "Легендарный мобильный телефон, известный своей невероятной прочностью, представленный в 2000 году. Nokia 3310 продалась тиражом более 126 миллионов единиц, став одним из самых успешных мобильных телефонов в истории. Помимо прочности, телефон был известен своей длительной работой от батареи, сменными панелями и популярной игрой 'Змейка'.",
    shortDescription: "Легендарный мобильный телефон, известный своей невероятной прочностью, представленный в 2000 году.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nokia_3310_blue_R7309170_%28retouch%29.png/800px-Nokia_3310_blue_R7309170_%28retouch%29.png",
    year: "2000",
    manufacturer: "Nokia",
    technicalSpecs: {
      "Дисплей": "Монохромный 84 x 48 пикселей",
      "Вес": "133 г",
      "Батарея": "900 мАч, до 260 часов в режиме ожидания",
      "Функции": "SMS, игры (Змейка, Память, Тетрис), будильник"
    },
    historicalContext: "Nokia 3310 появился в период быстрого роста рынка мобильных телефонов, когда они только начинали становиться предметами массового потребления. Его надежность, доступность и функциональность сделали его популярным во всем мире. В культурном плане, Nokia 3310 стал иконой дизайна и символом эпохи до смартфонов, а его слава породила множество интернет-мемов о его неразрушимости.",
    featured: true
  }
];

// Функция для добавления тестовых данных
const seedExhibits = async (force = false) => {
  try {
    // Проверяем, есть ли уже данные в таблице
    const count = await Exhibit.count();
    
    // Если данных нет или указан флаг принудительного заполнения
    if (count === 0 || force) {
      console.log('📥 Добавление тестовых экспонатов в базу данных...');
      
      // Создаем записи последовательно
      for (const item of defaultExhibits) {
        await Exhibit.create(item);
      }
      
      console.log(`✅ Добавлено ${defaultExhibits.length} тестовых экспонатов`);
    } else {
      console.log(`ℹ️ В базе данных уже есть ${count} экспонатов. Пропускаем добавление тестовых данных.`);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых экспонатов:', error);
  }
};

export { Exhibit, seedExhibits }; 