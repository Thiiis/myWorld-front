import axios from "axios";
import { useStore } from "vuex";

const store = useStore();

// 방명록 작성
function createGuestBoard(guestboard) {
  return axios.post(`/guestboards/create/${store.state.hostid}`, guestboard);
}

// 방명록 조회
function getGuestBoard(mid, offset = 0, limit = 10) {
  return axios.get("/guestboards/list", {
    params: { mid, offset, limit },
  });
}

// 방명록 업데이트
function updateGuestBoard(guestboard) {
  return axios.put("/guestboards/update", guestboard);
}

// 방명록 삭제
function deleteGuestBoard(gbid) {
  return axios.delete("/guestboards/delete", {
    params: { gbid },
  });
}

const guestboardApi = {
  createGuestBoard,
  getGuestBoard,
  updateGuestBoard,
  deleteGuestBoard,
};

export default guestboardApi;
