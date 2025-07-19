import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const saveMatch = data => API.post('/match/save', data);
export const getMatchesByPlayer = nickname => API.get(`/match/player/${nickname}`);
