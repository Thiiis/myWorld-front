import { api } from '@/apis/axiosApi';

function createSong(song) {
  return api.post(`/songs/create`, song);
}

function searchSong(query) {
  return api.get(`/songs/search`, {params: { query }});
}

function getMySong() {
  return api.get("/songs/mysongs");
}

function deleteSong(sid) {
  return api.delete(`/songs/delete/${sid}`);
}


export default { createSong, searchSong, getMySong, deleteSong };
