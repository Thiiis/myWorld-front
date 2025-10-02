import { api } from '@/apis/axiosApi';

function createGuestBoard(hostaccount, guestboard) {
  return api.post(`/guestboards/create/${hostaccount}`, guestboard);
}

function getGuestBoard(hostaccount, offset = 0, limit = 10) {
  return api.get(`/guestboards/list/${hostaccount}`, { params: { offset, limit } });
}

function updateGuestBoard(guestboard) {
  return api.put("/guestboards/update", guestboard);
}

function deleteGuestBoard(gbid) {
  return api.delete(`/guestboards/delete/${gbid}`);
}


export default { createGuestBoard, getGuestBoard, updateGuestBoard, deleteGuestBoard };
