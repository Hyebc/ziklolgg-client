import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChampionRanking = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    axios.get('/api/ranking/champion-winrates')
      .then(res => setRankings(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">챔피언 승률 랭킹</h1>
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">순위</th>
            <th className="p-2">챔피언</th>
            <th className="p-2">경기 수</th>
            <th className="p-2">승률 (%)</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((champ, idx) => (
            <tr key={champ.champion} className="border-b border-gray-800">
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{champ.champion}</td>
              <td className="p-2">{champ.games}</td>
              <td className="p-2">{champ.winRate.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChampionRanking;
