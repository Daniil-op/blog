import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEye, FaHeart, FaCommentAlt, FaBookmark } from 'react-icons/fa';
import './card.css';

const Card = ({ article }) => {
  return (
    <div className="card-wrapper">
      <div className='card-container'>
        <article>
          <div className='card-header'>
            <h3 className='card-title'>{article.title}</h3>
            <div className='card-meta'>
              <span className='meta-item'>
                <span>{article.difficulty}</span>
              </span>
              <span className='meta-item'>
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
            <p>{article.description.length > 150 ? `${article.description.slice(0, 150)}...` : article.description}</p>
          </div>
        </article>
        
        <div className='card-footer'>
          <div className='card-actions'>
            <Link to={`/article/${article.id}`} className="read-more-btn">
              Читать далее
            </Link>
            
            <div className='action-buttons'>
              <div className='action-info'>
                <FaHeart />
                <span>{article.likesCount || 0}</span>
              </div>
              <div className='action-info'>
                <FaCommentAlt />
                <span>{article.commentsCount || 0}</span>
              </div>
              <div className='action-info'>
                <FaBookmark />
                <span>{article.favoritesCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
