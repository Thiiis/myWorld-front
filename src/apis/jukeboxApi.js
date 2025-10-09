import { api } from '@/apis/axiosApi';

// 주크박스 생성
function createJukebox(jukebox) {
  return api.post("/jukeboxes/create", jukebox);
}

function getJukeboxList(account) {
  return api.get("/jukeboxes/list", {params: { account }});
}

function getJukeboxDetail(jid) {
  return api.get("/jukeboxes/detail", {params: { jid }});
}

function updateJukebox(jukebox) {
  return api.put("/jukeboxes/update", jukebox);
}

function deleteJukebox(jid) {
  return api.delete(`/jukeboxes/delete/${jid}`);
}

function likeJukebox(jid) {
  return api.post("/jukeboxes/like", null, {params: { jid }});
}




// 음악 생성
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




// 트랙 생성
function createTrack(track) {
  return api.post("/tracks/create", track);
}

function getMyTrack(jid) {
  return api.get("tracks/list", { params: { jid }});
}

function deleteTrack(trid) {
  return api.delete(`tracks/delete/${trid}`);
}


export default { 
  createJukebox, getJukeboxList, getJukeboxDetail, updateJukebox, deleteJukebox, likeJukebox,
  createSong, searchSong, getMySong, deleteSong,
  createTrack, getMyTrack, deleteTrack };
