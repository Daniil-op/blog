import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './create_article.css';

const categories = ['ИИ', 'Программирование', 'Soft Skills', 'Дизайн', 'Менеджмент', 'Маркетинг', 'Финансы', 'Наука', 'Образование', 'Здоровье'];
const levels = ['Простой', 'Средний', 'Сложный'];
const types = ['Статья', 'Пост', 'Новость'];
const languages = ['Русский', 'Английский'];

const CreateArticle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullText, setFullText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [level, setLevel] = useState(levels[0]);
  const [type, setType] = useState(types[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !imageFile) {
      setError('Заполните обязательные поля');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('fullText', fullText);
    formData.append('img', imageFile);
    formData.append('category', category);
    formData.append('difficulty', level);
    formData.append('type', type);
    formData.append('language', language);

    try {
      const response = await axios.post('http://localhost:5000/api/article', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Статья создана!');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания статьи');
    }
  };

  return (
    <div className="create-article-page">
      <div className="create-article-container">
        <h2>Написать статью</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Заголовок</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите заголовок" required />
          </div>
          <div className="form-group">
            <label>Краткое описание</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Введите краткое описание" required />
          </div>
          <div className="form-group">
            <label>Полный текст статьи</label>
            <textarea value={fullText} onChange={(e) => setFullText(e.target.value)} placeholder="Введите полный текст статьи" rows="10" />
          </div>
          <div className="form-group">
            <label>Изображение</label>
            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" required />
          </div>
          <div className="form-group">
            <label>Тип публикации</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Язык публикации</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Категория</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Уровень сложности</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button type="submit" className="submit-button">Отправить на модерацию</button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
