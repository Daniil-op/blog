import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Meter from "./meter.svg";
import Clock from "./clock.svg";
import Eye from "./eye.svg";
import './card.css';

const Card = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log(`Fetching article with ID: ${articleId}`);
        const response = await axios.get(`http://localhost:5000/api/article/${articleId}`);
        console.log('Response data:', response.data);
        setArticle(response.data);
      } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        setError('Не удалось загрузить статью. Пожалуйста, попробуйте позже.');
      }
    };

    fetchArticle();
  }, [articleId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className='container-card'>
        <article>
          <div className='title-card'>
            <p>{article.title}</p>
          </div>
          <div className='picks'>
            <img className='meter' src={Meter} alt="#" />
            <p className='piks-text'>Новости</p>
            <img className='clock' src={Clock} alt="#" />
            <p className='piks-text'>8 минут</p>
            <img className='eye' src={Eye} alt="#" />
            <p className='piks-text'>23</p>
          </div>
          <img className='img-post_card' src={`http://localhost:5000/${article.img}`} alt={article.title} />
          <div className='description-card'>
            <p>{article.description}</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Card;
