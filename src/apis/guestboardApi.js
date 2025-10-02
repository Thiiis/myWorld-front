import axios from "axios";

function createGuestBoard(hostaccount, guestboard) {
  return axios.post(`/guestboards/create/${hostaccount}`, guestboard);
}

function getGuestBoard(hostaccount, offset = 0, limit = 10) {
  return axios.get(`/guestboards/list/${hostaccount}`, { params: { offset, limit } });
}

function updateGuestBoard(guestboard) {
  return axios.put("/guestboards/update", guestboard);
}

function deleteGuestBoard(gbid) {
  return axios.delete(`/guestboards/delete/${gbid}`);
}


export default { createGuestBoard, getGuestBoard, updateGuestBoard, deleteGuestBoard };
