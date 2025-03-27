import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './article_page.css';
import { FaEye, FaHeart, FaComment, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

const ArticlePage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/article/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статьи:', error);
        setError('Не удалось загрузить статью. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка статьи...</p>
    </div>
  );
  
  if (error) return <div className="error-container">{error}</div>;
  if (!article) return <div className="not-found-container">Статья не найдена</div>;

  return (
    <div className="article-container">
      <article className="article-card-page">
        {/* Заголовок */}
        <header className="article-header">
          <h1 className="article-title-page">{article.title}</h1>
          
          {/* Мета-информация */}
          <div className="article-meta">
            <span className="meta-item">
              <FaUser className="meta-icon" />
              {article.user?.username || 'Неизвестный автор'}
            </span>
            <span className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="meta-item">
              <FaTag className="meta-icon" />
              {article.difficulty || 'Без категории'}
            </span>
          </div>
        </header>

        {/* Изображение статьи */}
        {article.img && (
          <div className="article-image-container">
            <img 
              src={`http://localhost:5000/${article.img}`} 
              alt={article.title} 
              className="article-image"
            />
          </div>
        )}

        {/* Описание */}
        <div className="article-description-page">
          <p>{article.description}</p>
        </div>

        {/* Основной текст */}
        <div className="article-content">
          {article.fullText ? (
            article.fullText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ))
          ) : (
            <p className="no-content">Нет полного текста статьи.</p>
          )}
        </div>

        {/* Футер со статистикой */}
        <footer className="article-footer">
          <div className="article-stats">
            <div className="stat-item">
              <FaHeart className="stat-icon" />
              <span>{article.likes || 0}</span>
            </div>
            <div className="stat-item">
              <FaComment className="stat-icon" />
              <span>{article.comments || 0}</span>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default ArticlePage;