const Router = require('express')
const router = new Router()
const articleRouter = require('./articleRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/article', articleRouter)

module.exports = router