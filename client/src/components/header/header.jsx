import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logotype from "./logo.svg";
import "./header.css";

function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const style_image = {
    width: 30,
    height: 30
  };

  return (
    <div className="header-container">
      <Link to="/" className="logotype">
        <img src={Logotype} alt="logo" style={style_image} />
        <h2 className="logotype-text">FutureTech</h2>
      </Link>

      {/* Бургер-меню */}
      <div className="burger-menu" onClick={toggleMenu}>
        <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
        <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Навигация */}
      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Лента</Link></li>
          <li><Link to="/news" onClick={toggleMenu}>Новости</Link></li>
          <li><Link to="/posts" onClick={toggleMenu}>Посты</Link></li>
          {user && <li><Link to="/profile" onClick={toggleMenu}>Профиль</Link></li>}
        </ul>

        {/* Кнопка "Войти" в меню */}
        <div className="auth-buttons-mobile">
          {user ? (
            <button className="button-logout" onClick={logout}>
              Выйти
            </button>
          ) : (
            <Link to="/auth" className="button-login" onClick={toggleMenu}>
              Войти
            </Link>
          )}
        </div>
      </nav>


      <div className="auth-buttons">
        {user ? (
          <button className="button-logout" onClick={logout}>
            Выйти
          </button>
        ) : (
          <Link to="/auth" className="button-login">
            Войти
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;