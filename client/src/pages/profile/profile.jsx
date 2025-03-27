import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [articlesRes, favoritesRes] = await Promise.all([
            axios.get('/api/article/user/articles', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }),
            axios.get('/api/article/user/favorites', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
          ]);
          
          setArticles(articlesRes.data);
          setFavoriteArticles(favoritesRes.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="loading-container">Загрузка профиля...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Профиль пользователя</h1>
        <div className="user-info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>Роль: {user.role}</p>
          <button onClick={logout} className="logout-btn">Выйти</button>
          
          {/* Добавленная кнопка для админа */}
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="admin-panel-btn">
              Админ-панель
            </Link>
          )}
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-articles">
          <h2>Мои статьи</h2>
          {articles.length === 0 ? (
            <p>Вы еще не создали ни одной статьи</p>
          ) : (
            <ul className="articles-list">
              {articles.map(article => (
                <li key={article.id} className="article-item">
                  <Link to={`/article/${article.id}`} className="article-link">
                    {article.title}
                  </Link>
                  <span className="article-status">{article.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="profile-favorites">
          <h2>Избранные статьи</h2>
          {favoriteArticles.length === 0 ? (
            <p>У вас пока нет избранных статей</p>
          ) : (
            <ul className="favorites-list">
              {favoriteArticles.map(article => (
                <li key={article.id} className="favorite-item">
                  <Link to={`/article/${article.id}`} className="favorite-link">
                    {article.title}
                  </Link>
                  <span className="article-author">{article.user?.username}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;