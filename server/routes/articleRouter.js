const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');

router.post('/create', articleController.create);
router.get('/get', articleController.getAll);
router.get('/:id', articleController.getById);
router.delete('/:id', articleController.deleteById);

module.exports = router;