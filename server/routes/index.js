const Router = require('express');
const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');

const router = new Router();

router.use('/user', userRouter); // Префикс /user для маршрутов пользователя
router.use('/article', articleRouter); // Префикс /article для маршрутов статей

module.exports = router;