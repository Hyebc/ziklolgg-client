import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [nickname, setNickname] = useState('');
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState('');
  const [champSummary, setChampSummary] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
  if (!nickname.trim()) {
    setMessage('닉네임을 입력해주세요.');
    return;
  }

  try {
    const res = await axios.get(`/api/match/player/${nickname.trim()}`);
    const rawData = res.data;
    const safeData = Array.isArray(rawData) ? rawData : rawData?.data || [];

    setRecords(safeData);
    setFilteredRecords(safeData);
    setMessage('');

    const champList = [...new Set(safeData.map((r) => r.champion))];
    setChampions(champList);
    setSelectedChampion('');
    setChampSummary(summarizeByChampion(safeData));
  } catch (error) {
    console.error('검색 실패', error);
    setMessage('검색 실패. 서버 오류 또는 해당 소환사가 없습니다.');
  }
};



  const summarizeByChampion = (data) => {
  const map = {};

  data.forEach((match) => {
    const { champion, k, d, a, win } = match;
    if (!map[champion]) {
      map[champion] = { count: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
    }
    map[champion].count++;
    if (win) map[champion].wins++;
    map[champion].kills += k;
    map[champion].deaths += d;
    map[champion].assists += a;
  });

  const summaryArray = Object.entries(map).map(([champion, stats]) => {
    const totalKA = stats.kills + stats.assists;
    const kda = stats.deaths === 0
      ? totalKA.toFixed(2)
      : (totalKA / stats.deaths).toFixed(2);

    return {
      champion,
      games: stats.count,
      wins: stats.wins,
      winRate: ((stats.wins / stats.count) * 100).toFixed(1),
      kda,
    };
  });

  // 승률 기준 내림차순 정렬
  return summaryArray.sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
};

  const handleChampionChange = (e) => {
    const selected = e.target.value;
    setSelectedChampion(selected);

    if (selected === '') {
      setFilteredRecords(records);
    } else {
      setFilteredRecords(records.filter((r) => r.champion === selected));
    }
  };

  const renderRating = (k, a, d) => {
    if (typeof k !== 'number' || typeof a !== 'number' || typeof d !== 'number') return 'N/A';
    if (d === 0) return (k + a).toFixed(2);
    return ((k + a) / d).toFixed(2);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🔍 소환사 전적 검색</h2>

      {/* 입력 필드와 버튼 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="소환사명 입력"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          검색
        </button>
      </div>

      {/* 오류 메시지 */}
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {/* 챔피언 요약 카드 */}
      {champSummary.length > 0 && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {champSummary.map((c) => (
            <div key={c.champion} className="bg-white rounded shadow p-4 border border-gray-200">
              <div className="font-bold text-purple-700 mb-1">{c.champion}</div>
              <div className="text-sm">게임 수: {c.games} | 승률: {c.winRate}%</div>
              <div className="text-sm">KDA: {c.kda}</div>
            </div>
          ))}
        </div>
      )}

      {/* 챔피언 필터 */}
      {champions.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">챔피언 필터:</label>
          <select
            value={selectedChampion}
            onChange={handleChampionChange}
            className="px-3 py-1 border border-gray-300 rounded-md"
          >
            <option value="">전체 보기</option>
            {champions.map((champ) => (
              <option key={champ} value={champ}>{champ}</option>
            ))}
          </select>
        </div>
      )}

      {/* 전적 리스트 */}
      
      <div className="space-y-4">
        
        {filteredRecords.map((r, index) => ( 
          <div key={index} className="bg-white-50 p-4 rounded border border-purple-400 shadow-sm">
            <strong>{r.nickname}</strong> - {r.champion} {r.matchTag && (
            <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-sm">
            {r.matchTag}
           </span>)}({r.matchDate})<br />
            {r.win ? '승리' : '패배'} | 퍼펙트: {r.perfect ? '🌟' : '—'}<br />
            KDA: {r.k} / {r.d} / {r.a} | 평점: <strong>{renderRating(r.k, r.a, r.d)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
