<template>
  <div class="card">
    <div class="card-body">
      <!-- 채팅방 목록 -->
      <div class="list-group">
        <div
          v-for="room in rooms"
          :key="room.roomId"
          class="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
        >
          <!-- 왼쪽: 프로필 + 대화 정보 -->
          <div class="d-flex align-items-center flex-grow-1" @click="openChat(room.roomId, { mid: room.friendMid, nickname: room.friendName, profileImg: room.friendProfileImg })" style="cursor:pointer">
            <img
              :src="room.friendProfileImg ? backendUrl + room.friendProfileImg : defaultProfile"
              class="rounded-circle me-3"
              style="width: 50px; height: 50px; object-fit: cover;"
            />
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <strong>{{ room.friendName }}</strong>
                <small class="text-muted">
                  {{ formatTime(room.lastMessageTime) }}
                </small>
              </div>
              <div class="text-truncate text-muted small" style="max-width: 80%;">
                {{ room.lastMessage || "메시지가 없습니다." }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 채팅방이 없을 때 -->
      <div v-if="rooms.length === 0" class="text-center text-muted mt-3">
        <i class="bi bi-chat-square-text display-4 mb-3"></i>
        <h4>아직 시작한 채팅이 없습니다</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import chatApi from "@/apis/chatApi";
import defaultProfile from "@/assets/image/default-profile.png";
import { useRouter } from "vue-router";
import store from "@/store";

const backendUrl = "http://192.168.4.42:8080"; // 백엔드 주소
const rooms = ref([]);
const router = useRouter();

// 채팅방 목록 불러오기
async function fetchRooms() {
  try {
    const res = await chatApi.getRooms();
    rooms.value = res.data || [];
  } catch (e) {
    console.error("채팅방 목록 로딩 실패:", e);
  }
}

// 날짜/시간 포맷 함수
function formatTime(time) {
  if (!time) return "";
  const date = new Date(time);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  if (isToday) {
    // 오늘 → 시:분
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (isYesterday) {
    return "어제";
  } else {
    // 그 외 → M월 D일
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  }
}

// 채팅방 열기
function openChat(roomId, friend) {
  store.commit("chat/addOpenRoom", { id: roomId, friend: friend });
}

onMounted(fetchRooms);
</script>

<style scoped>
.list-group-item {
  transition: background-color 0.2s;
}
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
