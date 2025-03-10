import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logotype from "../../components/header/logo.svg";
import UserIcon from "./icons/user.svg";
import AuthorIcon from "./icons/author.svg";
import { useAuth } from '../../context/AuthContext';
import './registration.css';

const Reg = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, username, password, role.toUpperCase()); // Передаем роль в верхнем регистре
      if (result.success) {
        navigate('/auth'); // Перенаправляем на страницу авторизации
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-modal-background">
      <div className="sign-up-modal">
        <Link to="/">
          <div id="close-modal-button" onClick={() => console.log('Close modal')}>
            <span></span>
          </div>
        </Link>
        <div className="logo-container">
          <Link to="/" className="logotype-auth">
            <img src={Logotype} alt="logo" style={style_image} />
            <h2 className="logotype-text-auth">FutureTech</h2>
          </Link>
        </div>

        <h2 className="form-title">Добро пожаловать! Выберите роль:</h2>
        <div className="role-selection">
          <button
            className={`role-button ${role === 'USER' ? 'active' : ''}`}
            onClick={() => setRole('USER')}
          >
            <img src={UserIcon} alt="user" className="role-icon" />
            Пользователь
          </button>
          <button
            className={`role-button ${role === 'AUTHOR' ? 'active' : ''}`}
            onClick={() => setRole('AUTHOR')}
          >
            <img src={AuthorIcon} alt="author" className="role-icon" />
            Автор
          </button>
        </div>

        <form className="details" onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              className="col-sm-12 username-input with-placeholder"
              id="username"
              type="text"
              placeholder="Имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-container">
            <input
              className="col-sm-12 email-input with-placeholder"
              id="email"
              type="email"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-container">
            <input
              className="col-sm-12 password-input with-placeholder"
              id="password"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="input-container">
            <input
              className="col-sm-12 password-input with-placeholder"
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <input
            id="sign-up-button"
            type="submit"
            value={isLoading ? "Регистрация..." : "Зарегистрироваться"}
            disabled={isLoading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="separator">ИЛИ</div>

          <div className="alternative-login">
            <button className="alt-login-button google">Войти через Google</button>
            <button className="alt-login-button apple">Войти через Apple</button>
            <button className="alt-login-button vk">Войти с помощью VK</button>
          </div>
          <p>
            Уже есть аккаунт? <Link to="/auth">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reg;