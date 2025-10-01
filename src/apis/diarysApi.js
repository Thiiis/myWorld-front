// src/api/diary.js
import api from './axios';

// 전체 일기 조회
export const fetchDiaries = () => api.get('/diaries');

// 단일 일기 조회
export const fetchDiary = (id) => api.get(`/diaries/${id}`);

// 일기 생성
export const createDiary = (data) => api.post('/diaries', data);

// 일기 수정
export const updateDiary = (id, data) => api.put(`/diaries/${id}`, data);

// 일기 삭제
export const deleteDiary = (id) => api.delete(`/diaries/${id}`);

// 다중 삭제
export const deleteMultipleDiaries = (ids) => api.post('/diaries/delete-multiple', { ids });
