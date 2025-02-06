import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home.jsx";
import News from "./pages/news/news.jsx";
import Posts from "./pages/posts/posts.jsx";
import Podcasts from "./pages/podcasts/podcasts.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/podcasts" element={<Podcasts />} />
            </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
