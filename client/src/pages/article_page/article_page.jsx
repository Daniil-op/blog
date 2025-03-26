import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './article_page.css';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article?status=APPROVED');
        setArticles(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
        setError('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchArticles();
  }, []);

  if (loading) return <div>Загрузка статей...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="article-page">
      {articles.length === 0 ? (
        <p>Нет опубликованных статей</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} className="article-card">
            <img src={`http://localhost:5000/${article.img}`} alt={article.title} />
            <div className="article-content">
              <h1>{article.title}</h1>
              <p className="article-description">{article.description}</p>
              <div className="article-fulltext">
                {article.fullText ? article.fullText.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                )) : <p>Нет полного текста статьи.</p>}
              </div>
            </div>
            <div className="article-date">
              <p>Опубликовано: {new Date(article.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ArticlePage;
