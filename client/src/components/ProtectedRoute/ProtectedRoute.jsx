import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Если идет загрузка данных аутентификации, можно показать индикатор загрузки
  if (loading) {
    return <div>Loading...</div>;
  }

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Если пользователь аутентифицирован, показываем запрашиваемую страницу
  return children;
};

export default ProtectedRoute;