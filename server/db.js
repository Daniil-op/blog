const { Sequelize } = require('sequelize');
require('dotenv').config(); // Add this to ensure env variables are loaded

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false // Add this to reduce console noise
  }
);