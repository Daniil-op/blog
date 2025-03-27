import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserArticles(),
        fetchFavoriteArticles()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchUserArticles = async () => {
    try {
      const response = await axios.get('/api/article/user/articles', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
    }
  };

  const fetchFavoriteArticles = async () => {
    try {
      const response = await axios.get('/api/article/favorites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFavoriteArticles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке избранных статей:', error);
    }
  };

  // Остальной код профиля остается прежним, добавляем блок избранного
  return (
    <div className="profile-container">
      {/* Существующие секции */}
      
      <div className="profile-favorites">
        <h2>Избранные статьи</h2>
        {favoriteArticles.length === 0 ? (
          <p>У вас пока нет избранных статей</p>
        ) : (
          <ul>
            {favoriteArticles.map((article) => (
              <li key={article.id}>
                <span className="article-title">{article.title}</span>
                <span className="article-author">{article.user.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;