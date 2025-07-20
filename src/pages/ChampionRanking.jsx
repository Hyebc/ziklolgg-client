import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChampionRanking = () => {
  const [champions, setChampions] = useState([]);
  const [selectedChampion, setSelectedChampion] = useState('');
  const [userRankings, setUserRankings] = useState([]);

  useEffect(() => {
    axios.get('/api/ranking/champions')
      .then(res => {
        if (Array.isArray(res.data)) {
          setChampions(res.data);
          setSelectedChampion(res.data[0] || '');
        }
      })
      .catch(err => console.error('❌ 챔피언 목록 에러', err));
  }, []);

  useEffect(() => {
    if (!selectedChampion) return;
    axios.get(`/api/ranking/winrate-by-user/${selectedChampion}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setUserRankings(res.data);
        } else {
          console.warn("❗유저 랭킹 응답이 배열이 아님:", res.data);
          setUserRankings([]);
        }
      })
      .catch(err => console.error('❌ 유저별 승률 에러', err));
  }, [selectedChampion]);

  return (
    <div className="p-6 text-purple">
      <h1 className="text-2xl font-bold mb-4">챔피언별 유저 승률 랭킹</h1>

      <select
        className="mb-4 p-2 bg-white-800 text-purple border border-gray-600"
        value={selectedChampion}
        onChange={e => setSelectedChampion(e.target.value)}
      >
        {Array.isArray(champions) && champions.length > 0 ? (
          champions.map((champ, idx) => (
            <option key={idx} value={champ}>{champ}</option>
          ))
        ) : (
          <option disabled>챔피언 목록 불러오는 중...</option>
        )}
      </select>

      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">순위</th>
            <th className="p-2">닉네임</th>
            <th className="p-2">경기 수</th>
            <th className="p-2">승률 (%)</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(userRankings) && userRankings.length > 0 ? (
            userRankings.map((user, idx) => (
              <tr key={user.nickname} className="border-b border-gray-800">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{user.nickname}</td>
                <td className="p-2">{user.games}</td>
                <td className="p-2">{user.winRate.toFixed(1)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-2 text-center text-gray-400">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChampionRanking;
