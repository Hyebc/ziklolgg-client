import React, { useState } from 'react';
import axios from 'axios';

const initialPlayer = {
  nickname: '',
  champion: '',
  k: 0,
  d: 0,
  a: 0,
  win: true,
  perfect: false
};

export default function Admin() {
  const [matchDate, setMatchDate] = useState('');
  const [matchTag, setMatchTag] = useState("");
  const [teamBlue, setTeamBlue] = useState([{ ...initialPlayer }]);
  const [teamRed, setTeamRed] = useState([{ ...initialPlayer }]);

  const handleChange = (teamSetter, team, index, field, value) => {
  const updated = [...team];
  if (field === 'perfect') {
    updated[index][field] = value.target.checked;
  } else if (value?.target) {
    updated[index][field] = value.target.value;
  } else {
    updated[index][field] = value;
  }
  teamSetter(updated);
};

  const addPlayer = (teamSetter, team) => {
    teamSetter([...team, { ...initialPlayer }]);
  };

  const removePlayer = (teamSetter, team) => {
    if (team.length > 1) {
      teamSetter(team.slice(0, -1));
    }
  };
  const isValidPlayer = (p) =>
  p.nickname?.trim() !== '' && p.champion?.trim() !== '';

  const submitData = async () => {
    try {
      const validBlue = teamBlue.filter(isValidPlayer);
      const validRed = teamRed.filter(isValidPlayer);

      const uid = Date.now();
      const matchData = {
        matchDate,
        matchTag,
        teamBlue: validBlue.map(p => ({
          ...p,
          k: parseInt(p.k),
          d: parseInt(p.d),
          a: parseInt(p.a),
          win: p.win === '승' || p.win === true,
          matchTag, 
        })),
        teamRed: validRed.map(p => ({
          ...p,
          k: parseInt(p.k),
          d: parseInt(p.d),
          a: parseInt(p.a),
          win: p.win === '승' || p.win === true,
          matchTag,
        })),
      };

      const res = await axios.post('https://ziklolgg-server.onrender.com/api/match/save', matchData);
      alert('✅ 저장 완료: ' + res.data.message);
    } catch (err) {
      console.error(err);
      alert('❌ 저장 실패: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>✏ 전적 입력 (관리자 전용)</h2>

      <label>날짜: </label>
      <input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} />
      <div className="mb-4">
      <label className="block mb-1 font-semibold text-sm">매치 태그 (예: #2025 멸망전 예선)</label>
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="#2025 멸망전 예선"
          value={matchTag}
          onChange={(e) => setMatchTag(e.target.value)}
        />
</div>
      <h3>🔵 블루팀</h3>
      <div className="grid grid-cols-[140px_140px_60px_60px_60px_60px_80px] gap-2 font-bold text-sm mb-2">
  <div>소환사명</div>
  <div>챔피언</div>
  <div>결과</div>
  <div>Kills</div>
  <div>Deaths</div>
  <div>Assists</div>
  <div>Perfect</div>
</div>

      
      {teamBlue.map((player, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[140px_140px_60px_60px_60px_60px_80px] gap-2 mb-2 items-center"
        >
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={player.nickname}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'nickname', e.target.value)}
          />
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={player.champion}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'champion', e.target.value)}
          />
          <select
            className="w-full border rounded px-1 py-1"
            value={player.result}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'win', e.target.value)}
          >
            <option value="승">승</option>
            <option value="패">패</option>
          </select>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.k}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'k', Number(e.target.value))}
          />
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.d}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'd', Number(e.target.value))}
          />
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.a}
            onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'a', Number(e.target.value))}
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={player.perfect}
              onChange={(e) => handleChange(setTeamBlue, teamBlue, idx, 'perfect', e.target.checked)}
            />
            퍼펙트
          </label>
        </div>
      ))}
      <button onClick={() => addPlayer(setTeamBlue, teamBlue)}>+ 블루 추가</button>
      <button onClick={() => removePlayer(setTeamBlue, teamBlue)} className="hover:underline">- 블루 삭제</button>

      <h3>🔴 레드팀</h3>
      <div className="grid grid-cols-[140px_140px_60px_60px_60px_60px_80px] gap-2 font-bold text-sm mb-2">
  <div>소환사명</div>
  <div>챔피언</div>
  <div>결과</div>
  <div>Kills</div>
  <div>Deaths</div>
  <div>Assists</div>
  <div>Perfect</div>
</div>

      {teamRed.map((player, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[140px_140px_60px_60px_60px_60px_80px] gap-2 mb-2 items-center"
        >
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={player.nickname}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'nickname', e.target.value)}
          />
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={player.champion}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'champion', e.target.value)}
          />
          <select
            className="w-full border rounded px-1 py-1"
            value={player.result}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'win', e.target.value)}
          >
            <option value="승">승</option>
            <option value="패">패</option>
          </select>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.k}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'k', Number(e.target.value))}
          />
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.d}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'd', Number(e.target.value))}
          />
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={player.a}
            onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'a', Number(e.target.value))}
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={player.perfect}
              onChange={(e) => handleChange(setTeamRed, teamRed, idx, 'perfect', e.target.checked)}
            />
            퍼펙트
          </label>
        </div>
      ))}
      <button onClick={() => addPlayer(setTeamRed, teamRed)}>+ 레드 추가</button>
      <button onClick={() => removePlayer(setTeamRed, teamRed)} className="hover:underline">- 레드 삭제</button>

      <br /><br />
      <button onClick={submitData}>💾 저장</button>
    </div>
  );
}
