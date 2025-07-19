import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(id, pw);
    if (success) {
      navigate('/admin');
    } else {
      setError('❌ 로그인 실패: ID 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔐 관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="ID"
          value={id}
          onChange={e => setId(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={e => setPw(e.target.value)}
        /><br /><br />
        <button type="submit">로그인</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
