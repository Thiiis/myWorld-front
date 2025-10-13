import axiosApi from "@/apis/axiosApi";

function getMessages(roomId) {
  return axiosApi.api.get(`/chat/rooms/${roomId}/messages`);
}

function createRoom(mid) {
  return axiosApi.api.post(`/chat/rooms?mid=${mid}`);
}

function getRooms() {
  return axiosApi.api.get(`/chat/rooms`);
}

function getUnreadCount(roomId) {
  return axiosApi.api.get(`/chat/rooms/${roomId}/unread-count`);
}

export default {
  getMessages,
  createRoom,
  getRooms,
  getUnreadCount
};
