import React from 'react';
import Card from '../../components/cards/card.jsx';
import Asside from "../../components/asside/asside.jsx";

function News() {
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

export default News;
