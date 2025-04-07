import "./asside.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Asside() {
  const [popularArticles, setPopularArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для ограничения количества слов
  const limitWords = (text, maxWords = 5) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchPopularArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/article/status/APPROVED');
        const articlesWithLikes = await Promise.all(
          response.data.map(async article => {
            try {
              const likesResponse = await axios.get(`http://localhost:5000/api/article/${article.id}/stats`);
              return {
                ...article,
                likesCount: likesResponse.data.likesCount || 0
              };
            } catch (error) {
              console.error(`Error fetching likes for article ${article.id}:`, error);
              return {
                ...article,
                likesCount: 0
              };
            }
          })
        );
        const sortedArticles = articlesWithLikes
          .sort((a, b) => b.likesCount - a.likesCount)
          .slice(0, 6);
        
        setPopularArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching popular articles:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArticles();
  }, []);

  if (loading) {
    return <div className="asside-container">Загрузка популярных статей...</div>;
  }

  if (error) {
    return <div className="asside-container">Ошибка: {error}</div>;
  }

  return (
    <div className="asside-container">
      <aside>
        <p className="asside-text">Самые популярные статьи</p>
        <div className="line"></div>
        <ul>
          {popularArticles.map((article) => (
            <div className="article" key={article.id}>
              <img 
                className="img-article-asside" 
                src={`http://localhost:5000/${article.img}`} 
                alt={limitWords(article.title)} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/50';
                }}
              />
              <a className="article_a" href={`/article/${article.id}`}>
                {limitWords(article.title)}
              </a>
              <span className="likes-count">{article.likesCount} ♥</span>
            </div>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Asside;