const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, articleController.create); // Добавляем проверку авторизации
router.get('/get', articleController.getAll);
router.get('/:id', articleController.getById);
router.delete('/:id', authMiddleware, articleController.deleteById);

module.exports = router;