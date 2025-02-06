const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');

// Создание статьи
router.post('/create', articleController.create);

// Получение всех статей
router.get('/get', articleController.getAll);

// Получение статьи по id
router.get('/:id', articleController.getById);

// Удаление статьи по id
router.delete('/:id', articleController.deleteById);

module.exports = router;
