import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { 
  FaEye, 
  FaUser, 
  FaEnvelope, 
  FaCrown, 
  FaSignOutAlt, 
  FaBook, 
  FaHeart, 
  FaPen, 
  FaClock, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';
import './profile.css';

const Profile = () => {
  const { favorites, updateFavorites } = useFavorites();
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('myArticles');

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          // Загружаем все статьи пользователя, если он автор или админ
          if (user.role === 'AUTHOR' || user.role === 'ADMIN') {
            const response = await axios.get('http://localhost:5000/api/articles', {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            // Фильтруем статьи, оставляя только те, которые принадлежат текущему пользователю
            const userArticles = response.data.filter(article => 
              article.userId === user.id
            );
            
            setArticles(userArticles);
          }

          await updateFavorites();
          setLoading(false);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setError(error.response?.data?.message || 'Failed to fetch profile data');
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, updateFavorites]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="status-badge pending"><FaClock /> На модерации</span>;
      case 'APPROVED':
        return <span className="status-badge approved"><FaCheck /> Опубликовано</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><FaTimes /> Отклонено</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Загрузка профиля...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">
        Попробовать снова
      </button>
    </div>
  );

  if (!user) return (
    <div className="error-container">
      <p>Пользователь не найден. Пожалуйста, войдите в систему.</p>
      <Link to="/login" className="login-btn">Войти</Link>
    </div>
  );

  const userInitial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-card">
          <div className="user-avatar">
            {userInitial}
          </div>
          <h2 className="user-name">{user.username || 'Пользователь'}</h2>
          <div className="user-meta">
            <p><FaEnvelope /> {user.email || 'Email не указан'}</p>
            <p className={`user-role ${user.role ? user.role.toLowerCase() : 'user'}`}>
              {user.role === 'ADMIN' ? <FaCrown /> : <FaUser />}
              {user.role === 'ADMIN' ? 'Администратор' : 
               user.role === 'AUTHOR' ? 'Автор' : 'Пользователь'}
            </p>
          </div>
          
          <div className="user-actions">
            <button onClick={logout} className="logout-btn">
              <FaSignOutAlt /> Выйти
            </button>
            
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="admin-panel-btn">
                <FaCrown /> Админ-панель
              </Link>
            )}
            
            {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
              <Link to="/create-article" className="new-article-btn">
                <FaPen /> Новая статья
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
            <button 
              className={`tab-btn ${activeTab === 'myArticles' ? 'active' : ''}`}
              onClick={() => setActiveTab('myArticles')}
            >
              <FaBook /> Мои статьи ({articles.length})
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <FaHeart /> Избранное ({favorites.length})
          </button>
        </div>

        <div className="articles-section">
          {activeTab === 'myArticles' ? (
            <>
              <h2 className="section-title">Мои статьи</h2>
              {articles.length === 0 ? (
                <div className="empty-state">
                  <FaBook className="empty-icon" />
                  <p>Вы еще не создали ни одной статьи, статьте автором и публикуйте ваши идеи</p>
                  {(user.role === 'AUTHOR' || user.role === 'ADMIN') && (
                    <Link to="/create-article" className="create-btn">
                      Создать первую статью
                    </Link>
                  )}
                </div>
              ) : (
                <div className="articles-grid">
                  {articles.map(article => (
                    <div key={article.id} className="article-card">
                      <Link to={`/article/${article.id}`} className="article-link">
                        {article.img && (
                          <div className="article-image">
                            <img 
                              src={`http://localhost:5000/${article.img}`} 
                              alt={article.title} 
                              onError={(e) => {
                                e.target.src = '/default-article-image.jpg';
                              }}
                            />
                          </div>
                        )}
                        <div className="article-content">
                          <h3 className="article-title">{article.title}</h3>
                          <p className="article-description">
                            {article.description?.substring(0, 100) || 'Описание отсутствует'}...
                          </p>
                          <div className="article-meta">
                            <span className="article-date">
                              {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                            <span className="article-views">
                              <FaEye /> {article.views || 0}
                            </span>
                          </div>
                          {getStatusBadge(article.status)}
                          {article.status === 'REJECTED' && article.rejectComment && (
                            <div className="reject-comment">
                              <p>Причина отклонения: {article.rejectComment}</p>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="section-title">Избранные статьи</h2>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <FaHeart className="empty-icon" />
                  <p>У вас пока нет избранных статей</p>
                  <Link to="/" className="explore-btn">
                    Найти интересные статьи
                  </Link>
                </div>
              ) : (
                <div className="articles-grid">
                  {favorites.map(article => (
                    <div key={article.id} className="article-card">
                      <Link to={`/article/${article.id}`} className="article-link">
                        {article.img && (
                          <div className="article-image-profile">
                            <img 
                              src={`http://localhost:5000/${article.img}`} 
                              alt={article.title}
                              onError={(e) => {
                                e.target.src = '/default-article-image.jpg';
                              }}
                            />
                          </div>
                        )}
                        <div className="article-content">
                          <h3 className="article-title">{article.title}</h3>
                          <p className="article-description">
                            {article.description?.substring(0, 100) || 'Описание отсутствует'}...
                          </p>
                          <div className="article-meta">
                            <span className="article-author">
                              <FaUser /> {article.user?.username || 'Неизвестный автор'}
                            </span>
                            <span className="article-date">
                              {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;