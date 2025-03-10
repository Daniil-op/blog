import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logotype from "./logo.svg";
import "./header.css";

function Header() {
  const { user, logout } = useAuth();

  const style_image = {
    width: 30,
    height: 30
  };

  return (
    <div className="container">
      <Link to="/" className="logotype">
        <img src={Logotype} alt="logo" style={style_image} />
        <h2 className="logotype-text">FutureTech</h2>
      </Link>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Лента</Link></li>
          <li><Link to="/news">Новости</Link></li>
          <li><Link to="/posts">Посты</Link></li>
          {user && <li><Link to="/profile">Профиль</Link></li>}
          {user?.role === 'AUTHOR' && (
            <li>
              <Link to="/create-article">Написать</Link>
            </li>
          )}
        </ul>
      </nav>

      {user ? (
        <>
          <button className="button-logout" onClick={logout}>
            <p>Выйти</p>
          </button>
        </>
      ) : (
        <>
          <button className="button-contact">
            <Link to="/auth"><p>Войти</p></Link>
          </button>
          <button className="button-contact-login">
            <Link to="/registration"><p>Регистрация</p></Link>
          </button>
        </>
      )}
    </div>
  );
}

export default Header;