// src/api/diary.js
import { api } from '@/apis/axiosApi';
import store from "@/store";

// 📌 일기 생성 (멀티파트)
function createDiary(formData) {
  return api.post("/diaries/create", formData, {
    headers: {
      Authorization: `Bearer ${store.state.jwt}`,
      "Content-Type": "multipart/form-data"
    }
  });
}

// 📌 일기 상세 조회
function getDiary(did) {
  return api.get("/diaries/list/detail", { params: { did } });
}

// 📌 일기 리스트 조회 (pageNo 기반)
function getDiaries(pageNo = 1) {
  return api.get("/diaries/list", { params: { pageNo } });
}

// 📌 일기 수정 (멀티파트 + 삭제 aid 파라미터)
function updateDiary(formData, deleteAids = []) {
  return api.post("/diaries/update", formData, {
    params: { deleteAids },
    headers: {
      Authorization: `Bearer ${store.state.jwt}`,
      "Content-Type": "multipart/form-data"
    }
  });
}

// 📌 일기 단일 삭제
function deleteDiary(did) {
  return api.delete(`/diaries/delete/${did}`, {
    headers: { Authorization: `Bearer ${store.state.jwt}` }
  });
}

// 📌 일기 다중 삭제
function deleteMultipleDiaries(dids) {
  return api.delete("/diaries/delete-list", {
    params: { did: dids }, // did=1&did=2&did=3 식으로 전송됨
    headers: { Authorization: `Bearer ${store.state.jwt}` }
  });
}

export default {
  createDiary,
  getDiary,
  getDiaries,
  updateDiary,
  deleteDiary,
  deleteMultipleDiaries
};
