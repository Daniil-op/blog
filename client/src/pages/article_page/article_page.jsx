import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './article_page.css';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/article/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке статьи:', error);
        setError('Не удалось загрузить статью. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Загрузка статьи...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Статья не найдена.</div>;
  }

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
