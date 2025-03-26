import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './article_page.css';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article');
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке статей:', error);
        setError('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Загрузка статей...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <img src={`http://localhost:5000/${article.img}`} alt={article.title} />
      <div className="article-content">
        <p className="article-description">{article.description}</p>
        <div className="article-fulltext">
          {article.fullText ? (
            article.fullText.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <div className="article-date">
        <p>Опубликовано: {new Date(article.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ArticlePage;
