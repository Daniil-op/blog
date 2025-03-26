import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './create_article.css';

const CreateArticle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !img) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('img', img);

    try {
      const response = await axios.post('http://localhost:5000/api/article/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при создании статьи');
    }
  };

  return (
    <div className="create-article-page">
      <div className="create-article-container">
        <h2>Написать статью</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок"
            />
          </div>
          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание"
            />
          </div>
          <div className="form-group">
            <label>Изображение</label>
            <input
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>
          <button type="submit" className="submit-button">
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;