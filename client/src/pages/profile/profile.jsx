import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Вы не авторизованы</h2>
        <Link to="/auth" className="btn-link">Войти</Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Имя пользователя:</span>
          <span className="field-value">{user.username}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Email:</span>
          <span className="field-value">{user.email}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Роль:</span>
          <span className="field-value">{user.role}</span>
        </div>
      </div>
      <button onClick={logout} className="logout-btn">Выйти</button>
    </div>
  );
};

export default Profile;