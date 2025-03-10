const Router = require('express');
const userRouter = require('./userRouter');
const articleRouter = require('./articleRouter');

const router = new Router();

router.use('/user', userRouter);
router.use('/article', articleRouter);

module.exports = router;