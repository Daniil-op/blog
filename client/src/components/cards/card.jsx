import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Meter from "./meter.svg";
import Clock from "./clock.svg";
import Eye from "./eye.svg";
import Like from "./like.svg";
import Repost from "./repost.svg";
import Comment from "./comment.svg";
import Close from "./close.svg";
import './card.css';

const Card = ({ articleId }) => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [showFullArticle, setShowFullArticle] = useState(false); 

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
        <div className='open-story'>
          <a
            href="#"
            className="tm-article-snippet__readmore"
            onClick={(e) => {
              e.preventDefault();
              setShowFullArticle(true);
            }}
          >
            <span>Читать далее</span>
          </a>
          <div className="arrowCta"></div>
        </div>
        <div className='actions'>
          <button className='action-button'>
            <img src={Like} alt="Like" />
            <span>0</span>
          </button>
          <button className='action-button'>
            <img src={Comment} alt="Comment" />
            <span>0</span>
          </button>
          <button className='action-button'>
            <img src={Repost} alt="Repost" />
            <span>0</span>
          </button>
        </div>
      </div>
      {showFullArticle && (
        <div className='full-article-overlay'>
          <div className='full-article-content'>
            <button className='close-button' onClick={() => setShowFullArticle(false)}>
              <img src={Close} alt="Close" />
            </button>
            <h2>{article.title}</h2>
            <img src={`http://localhost:5000/${article.img}`} alt={article.title} />
            <p>{article.fullText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;