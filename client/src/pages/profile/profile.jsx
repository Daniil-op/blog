import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const articles = [
    { id: 1, title: 'Как стать успешным автором', likes: 42 },
    { id: 2, title: '10 советов для начинающих', likes: 35 },
  ];

  const subscriptions = [
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Мария Петрова' },
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.username}</h1>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Лайки статей</span>
          <span className="stat-value">77</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Дата создания</span>
          <span className="stat-value">1 Mar, 2025</span>
        </div>
      </div>

      {user.role === 'AUTHOR' && (
        <div className="profile-articles">
          <h2>Мои статьи</h2>
          <ul>
            {articles.map((article) => (
              <li key={article.id}>
                <span className="article-title">{article.title}</span>
                <span className="article-likes">{article.likes}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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