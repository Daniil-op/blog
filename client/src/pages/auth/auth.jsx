import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logotype from "../../components/header/logo.svg";
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container-back">
      <div className="auth-header">
        <Link to="/" className="logotype-auth">
          <img src={Logotype} alt="logo" style={style_image} />
          <h2 className="logotype-text-auth">FutureTech</h2>
        </Link>
      </div>
      <div className="auth-form-container">
        <div className="auth-form">
          <h2 className="form-title">Вход в FutureTech</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                className="email-input"
                id="email"
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                className="password-input"
                id="password"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="continue-button">Войти</button>
          </form>

          <div className="separator">ИЛИ</div>

          <div className="alternative-login">
            <button className="alt-login-button google">Войти через Google</button>
            <button className="alt-login-button apple">Войти через Apple</button>
            <button className="alt-login-button vk">Войти с помощью VK</button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <p className="auth-link">
            Нет аккаунта? <Link to="/registration">Зарегистрируйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;