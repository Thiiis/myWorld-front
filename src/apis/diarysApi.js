import { api, fileApi } from "@/apis/axiosApi";

// 📌 일기 생성 (멀티파트)
function createDiary(formData, hostAccount = null) {
  const params = {};
  if (hostAccount) params.hostAccount = hostAccount; // ✅ 추가
  return fileApi.post("/diaries/create", formData, { params });
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
function updateDiary(formData, deleteAids = [], hostAccount = null) {
  const params = {};
  if (deleteAids.length) params.deleteAids = deleteAids; // 삭제할 aid 배열
  if (hostAccount) params.hostAccount = hostAccount; // hostAccount 전달
  return fileApi.post("/diaries/update", formData, { params });
}

// 📌 일기 단일 삭제
function deleteDiary(did, hostAccount = null) {
  const params = {};
  if (hostAccount) params.hostAccount = hostAccount;
  return api.delete(`/diaries/delete/${did}`, { params });
}

// 📌 일기 다중 삭제
function deleteMultipleDiaries(dids, hostAccount = null) {
  const params = { did: dids }; // ?did=1&did=2 ...
  if (hostAccount) params.hostAccount = hostAccount;
  return api.delete("/diaries/delete-list", { params });
}

export default { createDiary, getDiary, getDiaries, updateDiary, deleteDiary, deleteMultipleDiaries };