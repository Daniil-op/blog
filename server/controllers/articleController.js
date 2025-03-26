const uuid = require('uuid');
const path = require('path');
const { Article, User } = require('../models/models');
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
    const articles = await Article.findAll({
      where: { status: 'APPROVED' },
      include: [{ model: User, attributes: ['username'] }]
    });
    return res.json(articles);
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({
        where: { id },
        include: [{ model: User, attributes: ['username'] }]
      });

      if (!article) {
        return next(ApiError.notFound('Article not found'));
      }

      const user = req.user;
      if (article.status !== 'APPROVED' && (!user || user.id !== article.userId && user.role !== 'ADMIN')) {
        return next(ApiError.forbidden('You dont have access to this article'));
      }

      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
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
}

module.exports = new ArticleController();