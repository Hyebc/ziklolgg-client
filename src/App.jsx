import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Search from './pages/Search';
import Admin from './pages/Admin'; // 입력 폼이 여기에 있다고 가정

function App() {
  return (
    <Router>
      <div style={{ padding: '10px' }}>
        <Link to="/">전적 입력</Link> | <Link to="/search">전적 검색</Link>
      </div>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
