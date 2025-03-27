const Router = require('express');
const router = new Router();
const controller = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// Основные роуты
router.post('/', authMiddleware, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/status/APPROVED', controller.getApprovedArticles);
router.delete('/:id', authMiddleware, controller.deleteById);

// Модерация
router.get('/admin/moderation', // Убрал '/api/article'
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  controller.getForModeration
);

router.put('/admin/:id/approve', // Удалите '/api/article'
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  controller.approveArticle
);

router.put('/admin/:id/reject', // Удалите '/api/article'
  authMiddleware,
  checkRoleMiddleware('ADMIN'),
  controller.rejectArticle
);

router.post('/:id/like', authMiddleware, controller.likeArticle);
router.post('/:id/favorite', authMiddleware, controller.addToFavorites);
router.get('/user/favorites', authMiddleware, controller.getFavorites);
router.post('/:id/comment', authMiddleware, controller.addComment);
router.get('/:id/comments', controller.getComments);
router.get('/:id/check-actions', authMiddleware, controller.checkUserActions);

// Статьи пользователя
router.get('/user/articles', authMiddleware, controller.getUserArticles);

module.exports = router;
