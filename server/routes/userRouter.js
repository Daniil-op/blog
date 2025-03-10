const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration); // Эндпоинт для регистрации
router.post('/login', userController.login);
router.get('/get', authMiddleware, userController.get);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;