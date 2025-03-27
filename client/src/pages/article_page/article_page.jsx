import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './article_page.css';

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

  if (loading) return <div className="loading-message">Загрузка статьи...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!article) return <p className="not-found">Статья не найдена</p>;

  return (
    <div className="article-page">
      <div className="article-card-page">
        <h1 className="article-title-page">{article.title}</h1>
        
        {article.img && (
          <img 
            src={`http://localhost:5000/${article.img}`} 
            alt={article.title} 
            className="article-image"
          />
        )}

        <div className="article-meta">
          <span className="article-category">{article.category || 'Без категории'}</span>
          <span className="article-date">
            Опубликовано: {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="article-content">
          <p className="article-description">{article.description}</p>
          
          <div className="article-fulltext">
            {article.fullText ? (
              article.fullText.split('\n').map((paragraph, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <br />}
                  <p>{paragraph}</p>
                </React.Fragment>
              ))
            ) : (
              <p className="no-content">Нет полного текста статьи.</p>
            )}
          </div>
        </div>

        <div className="article-footer">
          <div className="article-stats">
            <span>👁️ {article.views || 0}</span>
            <span>👍 {article.likes || 0}</span>
            <span>💬 {article.comments || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;