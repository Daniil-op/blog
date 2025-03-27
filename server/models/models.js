const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
    validate: {
      isIn: [['USER', 'AUTHOR', 'ADMIN']],
    },
  },
});

const Article = sequelize.define('article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  fullText: { type: DataTypes.TEXT },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'статья', // Добавлено значение по умолчанию
    validate: {
      isIn: [['статья', 'пост', 'новость']],
    },
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'русский', // Добавлено значение по умолчанию
    validate: {
      isIn: [['русский', 'английский']],
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'разное', // Можно задать категорию по умолчанию
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'средний', // Добавлено значение по умолчанию
    validate: {
      isIn: [['простой', 'средний', 'сложный']],
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
    validate: {
      isIn: [['PENDING', 'APPROVED', 'REJECTED']],
    },
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rejectComment: { type: DataTypes.TEXT, allowNull: true },
  publishedAt: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: true
});


User.hasMany(Article);
Article.belongsTo(User);

module.exports = {
  User,
  Article
};