import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './admin.css';
import { FiCheck, FiX, FiClock, FiUser, FiCalendar, FiAlertCircle, FiBookmark } from 'react-icons/fi';

const AdminPanel = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return 'Не опубликована';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchArticles();
    }
  }, [user, activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (activeTab === 'pending') {
        response = await axios.get('http://localhost:5000/api/article/admin/moderation', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        response = await axios.get('http://localhost:5000/api/article', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            status: 'APPROVED'
          }
        });
      }
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статей:', error);
      setError('Не удалось загрузить статьи');
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
      setSuccess('Статья успешно одобрена');
      setTimeout(() => setSuccess(''), 3000);
      fetchArticles();
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
      setSuccess('Статья отклонена');
      setTimeout(() => setSuccess(''), 3000);
      setSelectedArticle(null);
      setRejectReason('');
      fetchArticles();
    } catch (error) {
      console.error('Ошибка отклонения:', error);
      setError('Ошибка при отклонении статьи');
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="status-badge pending"><FiClock /> На модерации</span>;
      case 'APPROVED':
        return <span className="status-badge approved"><FiCheck /> Одобрено</span>;
      case 'REJECTED':
        return <span className="status-badge rejected"><FiX /> Отклонено</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1 className="admin-title">Панель администратора</h1>
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            На модерации
          </button>
          <button
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Одобренные
          </button>
        </div>
      </header>

      <div className="admin-content">
        {success && (
          <div className="alert success">
            <FiCheck /> {success}
          </div>
        )}
        {error && (
          <div className="alert error">
            <FiAlertCircle /> {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Загрузка статей...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <FiBookmark size={48} />
            <h3>Нет статей для отображения</h3>
            <p>В этой категории пока нет статей</p>
          </div>
        ) : (
          <div className="articles-list">
            {articles.map(article => (
              <div key={article.id} className="article-card">
                {article.img && (
                  <div className="article-image">
                    <img
                      src={`http://localhost:5000/${article.img}`}
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = '/placeholder-article.jpg';
                      }}
                    />
                  </div>
                )}
                <div className="article-content">
                  <div className="article-header">
                    <h3 className="article-title">{article.title}</h3>
                    {renderStatusBadge(article.status)}
                  </div>
                  <div className="article-meta">
                    <span><FiUser /> {article.User?.username || 'Неизвестный автор'}</span>
                    <span><FiCalendar /> {formatDate(article.createdAt)}</span>
                  </div>
                  <p className="article-description">{article.description}</p>
                  
                  {activeTab === 'pending' && (
                    <div className="article-actions">
                      <button
                        onClick={() => handleApprove(article.id)}
                        className="btn approve-btn"
                      >
                        <FiCheck /> Одобрить
                      </button>
                      <button
                        onClick={() => setSelectedArticle(article)}
                        className="btn reject-btn"
                      >
                        <FiX /> Отклонить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedArticle && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Отклонение статьи</h3>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Вы собираетесь отклонить статью: <strong>{selectedArticle.title}</strong></p>
              <p>Пожалуйста, укажите причину отклонения:</p>
              <textarea
                placeholder="Например: статья содержит недостоверную информацию..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="reason-input"
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  setRejectReason('');
                }}
                className="btn cancel-btn"
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                className="btn confirm-btn"
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