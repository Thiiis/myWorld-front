import {api, fileApi } from "@/apis/axiosApi";
import store from "@/store";

// 📌 일기 생성 (멀티파트)
function createDiary(formData) {
  return fileApi.post("/diaries/create", formData);
}

// 📌 일기 상세 조회
function getDiary(did) {
  return api.get("/diaries/list/detail", { params: { did } });
}

// 📌 일기 리스트 조회 (pageNo 기반)
function getDiaries(pageNo = 1, hostAccount = null) {
  const params = {pageNo};
  if(hostAccount) params.hostAccount = hostAccount;
  return api.get("/diaries/list", { params });
}

// 📌 일기 수정 (멀티파트 + 삭제 aid 파라미터)
function updateDiary(formData, deleteAids = []) {
  return fileApi.post("/diaries/update", formData, { params: { deleteAids } });
}

// 📌 일기 단일 삭제
function deleteDiary(did) {
  return api.delete(`/diaries/delete/${did}`);
}

// 📌 일기 다중 삭제
function deleteMultipleDiaries(dids) {
  return api.delete("/diaries/delete-list", { params: { did: dids } });
}

export default { createDiary, getDiary, getDiaries, updateDiary, deleteDiary, deleteMultipleDiaries };