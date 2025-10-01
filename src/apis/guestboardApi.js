import axios from "axios";

function createGuestBoard(hostid, guestboard) {
  return axios.post("/guestboards/create/{hostid}", guestboard);
}

function getGuestBoard(offset = 0, limit = 10) {
  return axios.get("/guestboards/list", {params: { offset, limit }});
}

function updateGuestBoard(guestboard) {
  return axios.put("/guestboards/update", guestboard);
}

function deleteGuestBoard(gbid) {
  return axios.delete("/guestboards/delete", {params: { gbid }});
}


export default { createGuestBoard, getGuestBoard, updateGuestBoard, deleteGuestBoard };
