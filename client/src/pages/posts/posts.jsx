import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/card.jsx';
import Asside from "../../components/asside/asside.jsx";
import axios from 'axios';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article/type/post');
        // Преобразуем тип для отображения
        const formattedPosts = response.data.map(item => ({
          ...item,
          type: 'пост' // Заменяем 'post' на 'пост' для отображения
        }));
        setPosts(formattedPosts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Загрузка постов...</div>;
  if (error) return <div className="error">Ошибка загрузки: {error}</div>;

  return (
    <div className="wrapper-main content-page">
      <div className='content-container'>
        <div className='cards'>
          {posts.length > 0 ? (
            posts.map(article => (
              <Card key={article.id} article={article} />
            ))
          ) : (
            <div className="no-content">Постов пока нет</div>
          )}
        </div>
      </div>
      <Asside />
    </div>
  );
}

export default Posts;