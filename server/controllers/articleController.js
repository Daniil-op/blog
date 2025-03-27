const uuid = require('uuid');
const path = require('path');
const { Article, User, Like, Favorite, Comment } = require('../models/models');
const ApiError = require('../error/ApiError');

class ArticleController {
  async create(req, res, next) {
    try {
      const { title, description, fullText } = req.body;
      const { img } = req.files;

      if (!img || !title || !description) {
        return next(ApiError.badRequest('Необходимо заполнить все обязательные поля'));
      }

      const fileName = uuid.v4() + path.extname(img.name);
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const article = await Article.create({
        title,
        description,
        fullText: fullText || '',
        img: fileName,
        userId: req.user.id,
        status: 'PENDING'
      });

      return res.json(article);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res) {
    try {
      const articles = await Article.findAll({
        where: { status: 'APPROVED' },
        include: [{ model: User, attributes: ['username'] }],
        distinct: true,  // Добавлено для исключения дубликатов
      });
  
      return res.json(articles);  // Отправляем уникальные статьи
    } catch (e) {
      console.error('Ошибка при получении статей:', e);
      return res.status(500).send('Ошибка при загрузке данных');
    }
  }

  async getApprovedArticles(req, res) {
    try {
      const articles = await Article.findAll({ where: { status: 'APPROVED' } });
      return res.json(articles);
    } catch (error) {
      console.error('Ошибка при получении статей:', error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      
      const article = await Article.findOne({
        where: { id },
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }]
      });
  
      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }
  
      if (article.status !== 'APPROVED' && (!req.user || req.user.role !== 'ADMIN')) {
        return next(ApiError.forbidden('Доступ к статье ограничен'));
      }
  
      
      return res.json(article);
    } catch (e) {
      console.error('Ошибка при получении статьи:', e);
      next(ApiError.internal('Ошибка сервера при получении статьи'));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const article = await Article.findOne({ where: { id } });
      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }

      if (article.userId !== userId && req.user.role !== 'ADMIN') {
        return next(ApiError.forbidden('Нет прав для удаления этой статьи'));
      }

      await article.destroy();
      return res.json({ message: 'Статья успешно удалена' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  // Методы для админ-панели
  async getForModeration(req, res, next) {
    try {
      console.log('Moderation request received');
      console.log('User:', req.user);
      console.log('User role:', req.user.role);

      const articles = await Article.findAll({
        where: { status: 'PENDING' },
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }],
        order: [['createdAt', 'ASC']]
      });

      console.log('Found articles:', articles.length);
      return res.json(articles);
    } catch (e) {
      console.error('Moderation error:', e);
      next(ApiError.internal(e.message));
    }
  }

  async approveArticle(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }

      await article.update({
        status: 'APPROVED',
        publishedAt: new Date(),
        rejectComment: null
      });

      return res.json(article);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async rejectArticle(req, res, next) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return next(ApiError.badRequest('Укажите причину отклонения'));
      }

      const article = await Article.findByPk(id);
      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }

      await article.update({
        status: 'REJECTED',
        rejectComment: comment
      });

      return res.json(article);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getUserArticles(req, res, next) {
    try {
      const userId = req.user.id;
      const articles = await Article.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      return res.json(articles);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async likeArticle(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const article = await Article.findByPk(id);
      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }
  
      const existingLike = await Like.findOne({ where: { articleId: id, userId } });
  
      if (existingLike) {
        await existingLike.destroy();
        const likesCount = await Like.count({ where: { articleId: id } });
        return res.json({ liked: false, likesCount });
      } else {
        await Like.create({ articleId: id, userId });
        const likesCount = await Like.count({ where: { articleId: id } });
        return res.json({ liked: true, likesCount });
      }
    } catch (e) {
      console.error('Ошибка при лайке:', e);
      next(ApiError.internal('Ошибка сервера при лайке'));
    }
  }
  
async checkUserActions(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [isLiked, isFavorite] = await Promise.all([
            Like.findOne({ where: { userId, articleId: id } }),
            Favorite.findOne({ where: { userId, articleId: id } })
        ]);

        const likesCount = await Like.count({ where: { articleId: id } });
        const favoritesCount = await Favorite.count({ where: { articleId: id } });

        return res.json({
            isLiked: !!isLiked,
            isFavorite: !!isFavorite,
            likesCount,
            favoritesCount
        });
    } catch (e) {
        next(ApiError.internal(e.message));
    }
}
  
async addToFavorites(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const article = await Article.findByPk(id);
    if (!article) {
      return next(ApiError.notFound('Статья не найдена'));
    }

    const existingFavorite = await Favorite.findOne({ where: { userId, articleId: id } });

    if (existingFavorite) {
      await existingFavorite.destroy();
      const favoritesCount = await Favorite.count({ where: { articleId: id } });
      return res.json({ isFavorite: false, favoritesCount });
    } else {
      await Favorite.create({ userId, articleId: id });
      const favoritesCount = await Favorite.count({ where: { articleId: id } });
      return res.json({ isFavorite: true, favoritesCount });
    }
  } catch (e) {
    next(ApiError.internal(e.message));
  }
}
  
  async getFavorites(req, res, next) {
    try {
      const userId = req.user.id;
      const favorites = await Favorite.findAll({
        where: { userId },
        include: [{
          model: Article,
          include: [User]
        }]
      });
  
      return res.json(favorites.map(fav => fav.article));
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
  
  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const userId = req.user.id;
  
      if (!text) {
        return next(ApiError.badRequest('Текст комментария не может быть пустым'));
      }
  
      const article = await Article.findByPk(id);
      if (!article) {
        return next(ApiError.notFound('Статья не найдена'));
      }
  
      const comment = await Comment.create({
        text,
        userId,
        articleId: id
      });
  
      const commentWithUser = await Comment.findByPk(comment.id, {
        include: [User]
      });
  
      return res.json(commentWithUser);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
  
  async getComments(req, res, next) {
    try {
      const { id } = req.params;
      const comments = await Comment.findAll({
        where: { articleId: id },
        include: [User],
        order: [['createdAt', 'DESC']]
      });
  
      return res.json(comments);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getArticleStats(req, res, next) {
    try {
      const { id } = req.params;
      
      const [likesCount, favoritesCount, commentsCount] = await Promise.all([
        Like.count({ where: { articleId: id } }),
        Favorite.count({ where: { articleId: id } }),
        Comment.count({ where: { articleId: id } })
      ]);
  
      return res.json({
        likesCount,
        favoritesCount,
        commentsCount
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
  
}

module.exports = new ArticleController();