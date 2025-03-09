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
import Podcasts from "./pages/podcasts/podcasts.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import "./index.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/registration" element={<Reg />} />
      <Route path="/" element={
        <div className="wrapper">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;