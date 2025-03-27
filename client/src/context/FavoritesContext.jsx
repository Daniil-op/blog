import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const updateFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/article/user/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, updateFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);