const uuid = require('uuid');
const path = require('path');
const { Article } = require('../models/models');
const ApiError = require('../error/ApiError');

class ArticleController {
  async create(req, res, next) {
    try {
      let { title, description } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const article = await Article.create({ title, description, img: fileName });
      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const articles = await Article.findAll();
    return res.json(articles);
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({ where: { id } });
      if (!article) {
        return next(ApiError.notFound('Article not found'));
      }
      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({ where: { id } });
      if (!article) {
        return next(ApiError.notFound('Article not found'));
      }
      await article.destroy();
      return res.json({ message: 'Article deleted successfully' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ArticleController();
