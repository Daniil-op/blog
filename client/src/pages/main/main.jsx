import React from 'react';
import Card from '../../components/cards/card.jsx';
import "./main.css";
import Asside from "../../components/asside/asside.jsx";

function Main() {
  return (
    <div className="wrapper-main">
      <div className='cards'>
      <Card articleId={2} />
      <Card articleId={3} />
      </div>
        <Asside />
    </div>
  );
}

export default Main;
