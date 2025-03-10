import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Meter from "./meter.svg";
import Clock from "./clock.svg";
import Eye from "./eye.svg";
import Like from "./like.svg";
import Repost from "./repost.svg";
import Comment from "./comment.svg";
import './card.css';

const Card = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/article/${articleId}`);
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

  // Обрезаем описание до 150 символов
  const truncatedDescription = article.description.length > 150
    ? `${article.description.slice(0, 150)}...`
    : article.description;

  return (
    <div className="card-wrapper">
      <div className='container-card'>
        <article>
          <div className='title-card'>
            <p>{article.title}</p>
          </div>
          <div className='picks'>
            <img className='meter' src={Meter} alt="#" />
            <p className='piks-text'>{article.category}</p>
            <img className='clock' src={Clock} alt="#" />
            <p className='piks-text'>{article.readingTime}</p>
            <img className='eye' src={Eye} alt="#" />
            <p className='piks-text'>{article.views}</p>
          </div>
          <img className='img-post_card' src={`http://localhost:5000/${article.img}`} alt={article.title} />
          <div className='description-card'>
            <p>{truncatedDescription}</p>
          </div>
        </article>
        <div className='open-story'>
          <Link to={`/article/${articleId}`} className="tm-article-snippet__readmore">
            <span>Читать далее</span>
          </Link>
          <div className="arrowCta"></div>
        </div>
        <div className='actions'>
          <button className='action-button'>
            <img src={Like} alt="Like" />
            <span>{article.likes}</span>
          </button>
          <button className='action-button'>
            <img src={Comment} alt="Comment" />
            <span>{article.comments}</span>
          </button>
          <button className='action-button'>
            <img src={Repost} alt="Repost" />
            <span>{article.reposts}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;