import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"

// 여기에 속성을 하나 추가했다.
function addAuthheader(jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

// 로그아웃 했을 때 공통 authorization 헤더를 제거
function removeAuthHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

export default {addAuthheader, removeAuthHeader};