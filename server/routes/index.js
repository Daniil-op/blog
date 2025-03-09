const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');

router.use('/user', userRouter);
router.use('/article', articleRouter);

module.exports = router;