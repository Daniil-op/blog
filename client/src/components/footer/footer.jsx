import React from 'react';
import Logo from "./logo.svg";
import "./footer.css";


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={Logo} alt="Logo" className="logo-image" />
          <h2 className="logo-text">FutureTech</h2>
        </div>
        <div className='column'>
        <div className="footer-info">
          <h3>Главная</h3>
          <li><a href="/">Лента</a></li>
          <li><a href="/">Новости</a></li>
          <li><a href="/">Посты</a></li>
          <li><a href="/">Подкасты</a></li>
        </div>
        <div className="footer-info">
          <h3>Новости</h3>
          <li><a href="/">Компании</a></li>
          <li><a href="/">Блоги</a></li>
          <li><a href="/">Тренды</a></li>
        </div>
        <div className="footer-info">
          <h3>Посты</h3>
          <li><a href="/">IT</a></li>
          <li><a href="/">Ресурсы</a></li>
          <li><a href="/">Истории</a></li>
          <li><a href="/">Мемчики</a></li>
        </div>
        <div className="footer-info">
          <h3>Подкасты</h3>
          <li><a href="/">Продуктивность</a></li>
          <li><a href="/">Инновации</a></li>
          <li><a href="/">Репортажи</a></li>
          <li><a href="/">Наука</a></li>
        </div>
        </div>
        <div className='line-column'>
        </div>
        <div className='footer-down'>
          <p>Terms & Conditions & Privacy Policy</p>
          <p>© 2025 FutureTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;