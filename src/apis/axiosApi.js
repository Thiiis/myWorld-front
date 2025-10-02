// src/apis/axiosApi.js
import axios from 'axios';

// 하드코딩된 주소 대신, .env.development 객체에서 환경 변수를 불러옵니다.
const BASE_URL = process.env.VUE_APP_API_URL;

// --- 인스턴스 생성 ---

// 1. JSON 데이터 요청용 인스턴스
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 파일/폼 데이터 요청용 인스턴스 (주로 파일 업로드에 사용)
export const fileApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


// --- 인증 헤더 관리 함수 ---

/**
 * 생성된 모든 axios 인스턴스에 인증 헤더를 추가합니다.
 * @param {string} jwt - 로그인 시 발급받은 JWT 토큰
 */
export const addAuthHeader = (jwt) => {
  const token = `Bearer ${jwt}`;
  // api 인스턴스에 헤더 추가
  api.defaults.headers.common['Authorization'] = token;
  // fileApi 인스턴스에도 헤더 추가
  fileApi.defaults.headers.common['Authorization'] = token;
};

/**
 * 생성된 모든 axios 인스턴스에서 인증 헤더를 제거합니다.
 */
export const removeAuthHeader = () => {
  delete api.defaults.headers.common['Authorization'];
  delete fileApi.defaults.headers.common['Authorization'];
};

export default {
  api,
  fileApi,
  addAuthHeader,
  removeAuthHeader
};