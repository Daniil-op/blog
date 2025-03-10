const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Добавьте это
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload()); // Добавьте это
app.use('/api', router);

// Обработка ошибок
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error('Unable to connect to the database:', e);
  }
};

start();