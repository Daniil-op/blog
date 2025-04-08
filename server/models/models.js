const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  username: { type: DataTypes.STRING, allowNull: false }, 
  password: { type: DataTypes.STRING },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
    validate: {
      isIn: [['USER', 'AUTHOR', 'ADMIN']],
    },
  },
}, {
  timestamps: true  
});

const Article = sequelize.define('article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  fullText: { type: DataTypes.TEXT },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: User,
        key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'статья', 
    validate: {
      isIn: [['article', 'post', 'news']],
    },
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'русский',
    validate: {
      isIn: [['Русский', 'Английский']],
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'разное', 
  },
  readingTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5 // значение по умолчанию в минутах
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Простой', 'Средний', 'Сложный']],
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
    validate: {
      isIn: [['PENDING', 'APPROVED', 'REJECTED']],
    },
  },
  rejectComment: { type: DataTypes.TEXT, allowNull: true },
  publishedAt: { type: DataTypes.DATE, allowNull: true }
}, {
  timestamps: true
});


const Favorite = sequelize.define('favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Like = sequelize.define('like', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: true
});

// Обновим ассоциации
User.belongsToMany(Article, { through: Favorite });
Article.belongsToMany(User, { through: Favorite });

User.belongsToMany(Article, { through: Like });
Article.belongsToMany(User, { through: Like });

User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Article, { through: Favorite, foreignKey: 'userId' });
Article.belongsToMany(User, { through: Favorite, foreignKey: 'articleId' });

Favorite.belongsTo(Article, { foreignKey: 'articleId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment);
Comment.belongsTo(User);
Article.hasMany(Comment);
Comment.belongsTo(Article);

module.exports = {
  User,
  Article,
  Favorite,
  Like,
  Comment
};