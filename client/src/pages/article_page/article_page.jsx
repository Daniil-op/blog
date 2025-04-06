import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import './article_page.css';
import { FaHeart, FaCalendarAlt, FaUser, FaTag, FaBookmark } from 'react-icons/fa';

const ArticlePage = () => {
  const { updateFavorites } = useFavorites();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articleRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/article/${id}`, {
            params: { includeUser: true }
          }),
          axios.get(`http://localhost:5000/api/article/${id}/comments`, {
            params: { includeUser: true }
          })
        ]);
        
        setArticle(articleRes.data);
        setComments(commentsRes.data);
        setLikesCount(articleRes.data.likesCount || 0);
        setFavoritesCount(articleRes.data.favoritesCount || 0);
  
        if (isAuthenticated) {
          const actionsRes = await axios.get(`http://localhost:5000/api/article/${id}/check-actions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setIsLiked(actionsRes.data.isLiked);
          setIsFavorite(actionsRes.data.isFavorite);
          setLikesCount(actionsRes.data.likesCount);
          setFavoritesCount(actionsRes.data.favoritesCount);
        }
      } catch (error) {
        console.error('Ошибка при загрузке статьи:', error);
        setError('Не удалось загрузить статью. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/article/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/article/${id}/favorite`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setIsFavorite(response.data.isFavorite);
      setFavoritesCount(response.data.favoritesCount);
      await updateFavorites();
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/article/${id}/comment`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error);
    }
  };

  if (loading) return <div className="loading-container">Загрузка статьи...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!article) return <div className="not-found-container">Статья не найдена</div>;

  return (
    <div className="article-container">
      <article className="article-card-page">
        <header className="article-header-page">
          <h1 className="article-title-page">{article.title}</h1>
          
          <div className="article-meta">
          <span className="meta-item">
            <FaUser className="meta-icon" />
            {article.user?.username || 'Неизвестный автор'}
          </span>
            <span className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="meta-item">
              <FaTag className="meta-icon" />
              {article.difficulty || 'Без категории'}
            </span>
          </div>
        </header>

        {article.img && (
          <div className="article-image-container-page">
            <img 
              src={`http://localhost:5000/${article.img}`} 
              alt={article.title} 
              className="article-image-page"
            />
          </div>
        )}

        <div className="article-description-page">
          <p>{article.description}</p>
        </div>

        <div className="article-content-page">
          {article.fullText ? (
            article.fullText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ))
          ) : (
            <p className="no-content">Нет полного текста статьи.</p>
          )}
        </div>

        <footer className="article-footer">
          <div className="article-actions">
            <button 
              className={`action-btn ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
              disabled={!isAuthenticated}
              aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
            >
              <FaHeart className="stat-icon" />
              <span>{likesCount} {isLiked ? 'Вам нравится' : 'Нравится'}</span>
            </button>
            
            <button 
              className={`action-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              disabled={!isAuthenticated}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              <FaBookmark className="stat-icon" />
              <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
            </button>
          </div>
        </footer>
      </article>

      <div className="comments-section">
        <h3>Комментарии ({comments.length})</h3>
        
        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите ваш комментарий..."
              className="comment-input"
              rows="4"
              aria-label="Текст комментария"
            />
            <button type="submit" className="comment-submit-btn">Отправить</button>
          </form>
        )}
        
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Пока нет комментариев. Будьте первым!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <span className="comment-author">
                      {comment.user?.username || 'Аноним'}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;