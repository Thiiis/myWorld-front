import axios from "axios";

function createSong(song) {
  return axios.post(`/songs/create`, song);
}

function searchSong(query) {
  return axios.get(`/songs/search`, {params: { query }});
}

function getMySong() {
  return axios.get("/songs/mysongs");
}

function deleteSong(sid) {
  return axios.delete(`/songs/delete/${sid}`);
}


export default { createSong, searchSong, getMySong, deleteSong };
