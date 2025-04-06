import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/card.jsx';
import Asside from "../../components/asside/asside.jsx";
import axios from 'axios';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article/type/news');
        // Преобразуем тип для отображения
        const formattedNews = response.data.map(item => ({
          ...item,
          type: 'новость' // Заменяем 'news' на 'новость' для отображения
        }));
        setNews(formattedNews);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="loading">Загрузка новостей...</div>;
  if (error) return <div className="error">Ошибка загрузки: {error}</div>;

  return (
    <div className="wrapper-main content-page">
      <div className='content-container'>
        <div className='cards'>
          {news.length > 0 ? (
            news.map(article => (
              <Card key={article.id} article={article} />
            ))
          ) : (
            <div className="no-content">Новостей пока нет</div>
          )}
        </div>
      </div>
      <Asside />
    </div>
  );
}

export default News;