import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaClock, 
  FaHeart, 
  FaRegHeart,
  FaCommentAlt,
  FaBookmark,
  FaRegBookmark,
  FaSignLanguage
} from 'react-icons/fa';
import axios from 'axios';
import './card.css';

const Card = ({ article }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const fetchArticleStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/article/${article.id}/stats`);
        setLikesCount(response.data.likesCount);
        setFavoritesCount(response.data.favoritesCount);
        setCommentsCount(response.data.commentsCount);
      } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        setLikesCount(article.likesCount || 0);
        setFavoritesCount(article.favoritesCount || 0);
        setCommentsCount(article.commentsCount || 0);
      }
    };

    fetchArticleStats();
  }, [article.id]);

  return (
    <div className="card-wrapper">
      <div className='card-container'>
        <article>
          <div className='card-header'>
            <h3 className='card-title'>{article.title}</h3>
            <div className='card-meta'>
              <span className='meta-item-card'>
                <FaSignLanguage className='meta-icon' />
                <span>{article.difficulty}</span>
              </span>
              <span className='meta-item-card'>
                <FaClock className='meta-icon' />
                <span>{article.readingTime} мин</span>
              </span>
            </div>
          </div>
          
          <img 
            className='card-image' 
            src={`http://localhost:5000/${article.img}`} 
            alt={article.title} 
          />
          
          <div className='card-description'>
            <p>{article.description.length > 150 ? `${article.description.substring(0, 150)}...` : article.description}</p>
          </div>
        </article>
        
        <div className='card-footer'>
          <div className='card-actions'>
            <Link to={`/article/${article.id}`} className="read-more-btn">
              Читать далее
            </Link>
            
            <div className='action-buttons'>
              <div className='action-info'>
                {likesCount > 0 ? <FaHeart className="blue-icon" /> : <FaRegHeart className="blue-icon" />}
                <span className="count">{likesCount}</span>
              </div>
              <div className='action-info'>
                <FaCommentAlt className="blue-icon" />
                <span className="count">{commentsCount}</span>
              </div>
              <div className='action-info'>
                {favoritesCount > 0 ? <FaBookmark className="blue-icon" /> : <FaRegBookmark className="blue-icon" />}
                <span className="count">{favoritesCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;