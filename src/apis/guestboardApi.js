import axios from "axios";
import store from "@/store"

function createGuestBoard(hostaccount, guestboard) {
  return axios.post(`/guestboards/create/${hostaccount}`, guestboard, {
    headers: {
      Authorization: `Bearer ${store.state.jwt}`
    }
  });
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
