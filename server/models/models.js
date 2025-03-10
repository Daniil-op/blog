const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: {
    type: DataTypes.STRING,
    defaultValue: "USER",
    validate: {
      isIn: [['USER', 'AUTHOR']], 
    },
  },
});

const Article = sequelize.define('article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
})

User.hasMany(Article)
Article.belongsTo(User)

module.exports = {
  User,
  Article
}