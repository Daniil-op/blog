import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logotype from "../../components/header/logo.svg";
import UserIcon from "./icons/user.svg";
import AuthorIcon from "./icons/author.svg";
import EyeIcon from "./icons/eye.svg";
import EyeSlashIcon from "./icons/eye-slash.svg";
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
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    digit: false,
    uppercase: false,
    specialChar: false
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  useEffect(() => {
    // Валидация пароля при изменении
    setPasswordErrors({
      length: password.length >= 8,
      digit: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Проверка валидации пароля
    if (!Object.values(passwordErrors).every(Boolean)) {
      setError('Пароль не соответствует требованиям');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(email, username, password, role.toUpperCase());
      if (result.success) {
        navigate('/auth');
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

  const togglePasswordsVisibility = () => {
    setShowPasswords(!showPasswords);
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
          <div className="input-container password-input-container">
            <input
              className="col-sm-12 password-input with-placeholder"
              id="password"
              type={showPasswords ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordsVisibility}
            >
              <img 
                src={showPasswords ? EyeIcon : EyeSlashIcon} 
                alt={showPasswords ? "Скрыть пароль" : "Показать пароль"} 
                className="eye-icon"
              />
            </button>
          </div>

          <div className="input-container password-input-container">
            <input
              className="col-sm-12 password-input with-placeholder"
              id="confirmPassword"
              type={showPasswords ? "text" : "password"}
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordsVisibility}
            >
              <img 
                src={showPasswords ? EyeIcon : EyeSlashIcon} 
                alt={showPasswords ? "Скрыть пароль" : "Показать пароль"} 
                className="eye-icon"
              />
            </button>
          </div>
          <div className="password-validation">
            <p className={passwordErrors.length ? 'valid' : 'invalid'}>
              {passwordErrors.length ? '✓' : '✗'} Минимум 8 символов
            </p>
            <p className={passwordErrors.digit ? 'valid' : 'invalid'}>
              {passwordErrors.digit ? '✓' : '✗'} Содержит цифры
            </p>
            <p className={passwordErrors.uppercase ? 'valid' : 'invalid'}>
              {passwordErrors.uppercase ? '✓' : '✗'} Содержит заглавные буквы
            </p>
            <p className={passwordErrors.specialChar ? 'valid' : 'invalid'}>
              {passwordErrors.specialChar ? '✓' : '✗'} Содержит спецсимволы
            </p>
          </div>
          <input
            id="sign-up-button"
            type="submit"
            value={isLoading ? "Регистрация..." : "Зарегистрироваться"}
            disabled={isLoading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p className='auth-p'>
            Уже есть аккаунт? <Link to="/auth">Войти</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Reg;