// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://countriesnow.space/api/v0.1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
