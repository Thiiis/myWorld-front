import { api } from '@/apis/axiosApi';

// 친구 요청
function sendFriendRequest(accId) {
  return api.post("/friends", { accId });
}

// 친구 요청 목록 조회
function getFriendRequests() {
  return api.get("/friends/pending");
}

// 친구 요청 수락
function acceptFriend(fid) {
  return api.put(`/friends/${fid}/accept`);
}

// 친구 요청 거절
function rejectFriend(fid) {
  return api.put(`/friends/${fid}/reject`);
}

// 친구 목록 조회
function getFriendList(mid) {
  return api.get(`/friends/${mid}/list`);
}

// 친구 삭제
function removeFriend(fid) {
  return api.delete(`/friends/${fid}`);
}

export default {
  sendFriendRequest,
  getFriendRequests,
  acceptFriend,
  rejectFriend,
  getFriendList,
  removeFriend,
};