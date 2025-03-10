import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home.jsx";
import News from "./pages/news/news.jsx";
import Posts from "./pages/posts/posts.jsx";
import Auth from "./pages/auth/auth.jsx";
import Reg from "./pages/registration/registration.jsx";
import Profile from "./pages/profile/profile.jsx";
import CreateArticle from "./pages/create_article/create_article.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/registration" element={<Reg />} />
          <Route path="/create-article" element={
            <ProtectedRoute>
              <CreateArticle />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;