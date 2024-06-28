import axios from 'axios';
axios.defaults.headers.common['x-api-key'] = 'live_dqzx9gGAsy51dR76MW9oEWTcXRgRll8obeNyIbK5hMBfq7RtotA3JTBEj9B0oO9c';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1';

export function fetchBreeds() {
  return axios.get(`breeds`);
}

export function fetchCatByBreed(breedId) {
  return axios.get(`images/search?breed_ids=${breedId}`);
}