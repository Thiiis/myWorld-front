import { api } from '@/apis/axiosApi';

// 주크박스 생성
function createJukebox(jukebox) {
  return api.post("/jukeboxes/create", jukebox);
}

function getJukeboxList(mid) {
  return api.get("/jukeboxes/list", {params: { mid }});
}

function getJukeboxDetail(jid) {
  return api.get("/jukeboxes/detail", {params: { jid}});
}

function updateJukebox(jukebox) {
  return api.put("/jukeboxes/update", jukebox);
}

function deleteJukebox(jid) {
  return api.delete(`/jukeboxes/delete/${jid}`);
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

function getMyTrack() {
  return api.get("tracks/list");
}

function deleteTrack(trid) {
  return api.delete(`tracks/delete/${trid}`);
}


export default { 
  createJukebox, getJukeboxList, getJukeboxDetail, updateJukebox, deleteJukebox,
  createSong, searchSong, getMySong, deleteSong,
  createTrack, getMyTrack, deleteTrack };
