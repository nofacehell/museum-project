import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['лёгкий', 'средний', 'сложный'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'artist', 'timeline', 'style'],
    required: true
  },
  route: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Для игры "Память"
  memoryCards: [{
    name: String,
    author: String,
    image: String
  }],
  // Для игры "Угадай производителя"
  artistQuestions: [{
    title: String,
    image: String,
    artist: String,
    description: String
  }],
  // Можно добавить поля для других типов игр по мере необходимости
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['лёгкий', 'средний', 'сложный'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'artist', 'timeline', 'style'],
    required: true
  },
  route: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Для игры "Память"
  memoryCards: [{
    name: String,
    author: String,
    image: String
  }],
  // Для игры "Угадай производителя"
  artistQuestions: [{
    title: String,
    image: String,
    artist: String,
    description: String
  }],
  // Можно добавить поля для других типов игр по мере необходимости
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['лёгкий', 'средний', 'сложный'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'artist', 'timeline', 'style'],
    required: true
  },
  route: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Для игры "Память"
  memoryCards: [{
    name: String,
    author: String,
    image: String
  }],
  // Для игры "Угадай производителя"
  artistQuestions: [{
    title: String,
    image: String,
    artist: String,
    description: String
  }],
  // Можно добавить поля для других типов игр по мере необходимости
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 