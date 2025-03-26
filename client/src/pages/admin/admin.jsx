import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './admin.css';

const AdminPanel = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Добавьте функцию formatDate внутри компонента
  const formatDate = (dateString) => {
    if (!dateString) return 'Не опубликована';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPendingArticles();
    }
  }, [user]);

  const fetchPendingArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/article/admin/moderation', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статей:', error);
      setError('Не удалось загрузить статьи для модерации');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (articleId) => {
    try {
      await axios.put(`http://localhost:5000/api/article/admin/${articleId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPendingArticles();
    } catch (error) {
      console.error('Ошибка одобрения:', error);
      setError('Ошибка при одобрении статьи');
    }
  };

  const handleReject = async () => {
    if (!selectedArticle || !rejectReason.trim()) {
      setError('Укажите причину отклонения');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/article/admin/${selectedArticle.id}/reject`,
        { comment: rejectReason },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSelectedArticle(null);
      setRejectReason('');
      fetchPendingArticles();
    } catch (error) {
      console.error('Ошибка отклонения:', error);
      setError('Ошибка при отклонении статьи');
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Панель модерации статей</h1>
      <p className="admin-subtitle">Статьи, ожидающие проверки: {articles.length}</p>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Загрузка статей...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && articles.length === 0 && (
        <div className="no-articles">
          <p>Нет статей, требующих модерации</p>
        </div>
      )}

      <div className="articles-grid">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            {article.img && (
              <div className="article-image-container">
                <img
                  src={`http://localhost:5000/${article.img}`}
                  alt={article.title}
                  className="article-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-author">
                <span className="label">Автор:</span> {article.User?.username || 'Неизвестен'}
              </p>
              <p className="article-date">
                <span className="label">Дата создания:</span> {formatDate(article.createdAt)}
              </p>
              <p className="article-description">{article.description}</p>

              <div className="article-actions">
                <button
                  onClick={() => handleApprove(article.id)}
                  className="btn-approve"
                  title="Одобрить публикацию"
                >
                  <i className="fas fa-check"></i> Одобрить
                </button>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="btn-reject"
                  title="Отклонить публикацию"
                >
                  <i className="fas fa-times"></i> Отклонить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Отклонение статьи: {selectedArticle.title}</h3>
            <p>Укажите причину отклонения:</p>
            <textarea
              placeholder="Например: 'Статья содержит недостоверную информацию'..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="reason-textarea"
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setRejectReason('');
                }}
                className="btn-cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                className="btn-confirm-reject"
                disabled={!rejectReason.trim()}
              >
                Подтвердить отклонение
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;