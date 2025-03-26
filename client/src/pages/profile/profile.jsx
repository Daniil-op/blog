import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserArticles();
    }
  }, [user]);

  const fetchUserArticles = async () => {
    try {
      const response = await axios.get('/api/article/user/articles', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
      setLoading(false);
    }
  };

  const subscriptions = [
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Мария Петрова' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge pending">На модерации</span>;
      case 'APPROVED':
        return <span className="status-badge approved">Опубликовано</span>;
      case 'REJECTED':
        return <span className="status-badge rejected">Отклонено</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.username}</h1>
        {user.role === 'ADMIN' && (
          <a href="/admin" className="admin-link">Админ панель</a>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Статей</span>
          <span className="stat-value">{articles.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Опубликовано</span>
          <span className="stat-value">
            {articles.filter(a => a.status === 'APPROVED').length}
          </span>
        </div>
      </div>

      <div className="profile-articles">
        <h2>Мои статьи</h2>
        {articles.length === 0 ? (
          <p>У вас пока нет статей</p>
        ) : (
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <div className="article-header">
                  <span className="article-title">{article.title}</span>
                  {getStatusBadge(article.status)}
                </div>
                {article.status === 'REJECTED' && (
                  <div className="reject-comment">
                    <strong>Причина отклонения:</strong> {article.rejectComment}
                  </div>
                )}
                <div className="article-content">
                  <p>{article.description}</p>
                  {article.fullText && <p>{article.fullText}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-subscriptions">
        <h2>Подписки на авторов</h2>
        <ul>
          {subscriptions.map((subscription) => (
            <li key={subscription.id}>
              <span className="subscription-name">{subscription.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={logout} className="logout-btn">Выйти</button>
    </div>
  );
};

export default Profile;