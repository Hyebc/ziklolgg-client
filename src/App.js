import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import ExcelUpload from './pages/ExcelUpload';
import Search from './pages/Search';
import ChampionRanking from './pages/ChampionRanking'
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('ziklolgg_login') === 'true';
  });

  const handleLogin = (id, pw) => {
    if (id === 'zikops' && pw === '2025') {
      localStorage.setItem('ziklolgg_login', 'true');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('ziklolgg_login');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* 상단바 */}
      <header className="bg-purple-700 text-white font-bold text-lg py-4 px-6 shadow">
        <Link to="/search" className="hover:underline">
        ZIKLOL.GG - 모임원 전적 시스템
        </Link>
      </header>

      {/* 네비게이션 바 */}
      <nav className="flex flex-wrap items-center gap-4 px-6 py-3 bg-purple-100 text-purple-700 font-medium text-sm">
        <Link to="/search" className="hover:underline">🔍 검색</Link>
        <Link to="/ranking" className="hover:underline">📊 승률 랭킹</Link>

        {isLoggedIn ? (
          <>
            <Link to="/admin" className="hover:underline">✏ 입력</Link> <Link to="/upload" className="hover:underline">📤 엑셀 업로드</Link>
            
            <button
              onClick={handleLogout}
              className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">로그인</Link>
        )}
      </nav>

      {/* 페이지 내용 */}
      <main className="p-6">
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/ranking" element={<ChampionRanking />} />
          <Route
            path="/admin"
            element={isLoggedIn ? <Admin /> : <Navigate to="/login" />}
          />
          <Route path="/upload" element={isLoggedIn ? <ExcelUpload /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/search" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
