import React from 'react';
import { Link } from 'react-router-dom';
import Logotype from "./logo.svg";
import "./header.css";

const style_image = {
  width: 30,
  height: 30
};

function Header() {
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
          <li><Link to="/podcasts">Подкасты</Link></li>
        </ul>
      </nav>
      <button className="button-contact">
        <p>Войти</p>
      </button>
    </div>
  );
}

export default Header;
