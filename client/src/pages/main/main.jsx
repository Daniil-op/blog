import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../components/cards/card.jsx';
import "./main.css";
import Asside from "../../components/asside/asside.jsx";

function Main() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article/status/APPROVED');
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

  if (loading) {
    return <div>Загрузка статей...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="wrapper-main">
      <div className='cards'>
        {articles.map((article) => (
          <Card key={article.id} articleId={article.id} /> 
        ))}
      </div>
      <Asside />
    </div>
  );
}

export default Main;