<template>
  <div class="card">
    <div class="card-body">
      <!-- 채팅방 목록 -->
      <div
        v-for="room in rooms"
        :key="room.roomId"
        class="chat-card card mb-3 p-3 d-flex flex-row align-items-center justify-content-between"
      >
        <!-- 왼쪽: 프로필 + 대화 정보 -->
        <div
          class="d-flex align-items-center flex-grow-1"
          @click="openChat(room.roomId, { mid: room.friendMid, nickname: room.friendName, profileImg: room.friendProfileImg })"
          style="cursor:pointer;"
        >
          <img
            :src="room.friendProfileImg ? backendUrl + room.friendProfileImg : defaultProfile"
            class="rounded-circle me-3"
            style="width: 55px; height: 55px; object-fit: cover;"
          />

          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong>{{ room.friendName }}</strong>
              <div class="d-flex align-items-center gap-1">
                <span v-if="room.unreadCount > 0" class="unread-badge">{{ room.unreadCount }}</span>
                <small class="text-muted">{{ formatTime(room.lastMessageTime) }}</small>
            </div>
                        </div>
            <div class="text-truncate text-muted small" style="max-width: 75%;">
              {{ room.lastMessage || "메시지가 없습니다." }}
          </div>
        </div>   
      </div>
      </div>

      <!-- 채팅방이 없을 때 -->
      <div v-if="rooms.length === 0" class="text-center text-muted mt-4">
        <i class="bi bi-chat-square-text display-4 mb-3"></i>
        <h4>아직 시작한 채팅이 없습니다</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import chatApi from "@/apis/chatApi";
import defaultProfile from "@/assets/image/default-profile.png";
import { useRouter } from "vue-router";
import store from "@/store";
import { Client } from "@stomp/stompjs";

const backendUrl = "/api"; // 백엔드 주소
const rooms = ref([]);
const router = useRouter();

const client = ref(null);
const totalUnread = computed(() =>
  rooms.value.reduce((sum, r) => sum + (r.unreadCount || 0), 0)
);

function connectForList() {
  client.value = new Client({
    brokerURL: `ws://${window.location.host}/ws?jwt=${store.state.jwt}`,
  });

  client.value.onConnect = () => {
    // 모든 방 구독
    rooms.value.forEach((room) => {
      client.value.subscribe(`/topic/rooms/${room.roomId}`, (msg) => {
        const data = JSON.parse(msg.body);
        const activeRooms = store.state.chat.activeRooms;

        // 채팅목록에 마지막 메시지 업데이트
        window.dispatchEvent(
          new CustomEvent("chat-room-updated", {
            detail: {
              roomId: room.roomId,
              content: data.content,
              createdAt: data.createdAt,
            },
          })
        );

        // 채팅창이 닫혀있으면 unreadCount 증가
        if (!activeRooms.includes(room.roomId) && data.senderAccount !== store.state.account) {
        window.dispatchEvent(
          new CustomEvent("chat-room-unread", {
            detail: { roomId: room.roomId },
          })
        );
      }
    });
  });
};

  client.value.activate();
}

watch(totalUnread, (newVal) => {
  window.dispatchEvent(new CustomEvent("update-total-unread", { detail: newVal }));
});

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

async function fetchUnreadCount() {
  try {
    // 모든 방 순회하면서 각각의 unreadCount 호출
    for (const room of rooms.value) {
      const res = await chatApi.getUnreadCount(room.roomId);
      room.unreadCount = res.data; // 백엔드에서 받은 count 반영
    }
  } catch (e) {
    console.error("안읽은 메시지 수 불러오기 실패:", e);
  }
}

onMounted(async () => {
  await fetchRooms();         // 전체 방 목록 불러오기
  await fetchUnreadCount();   // 안읽은 메시지 개수 병합
  connectForList();

  // 새 메시지
  window.addEventListener("chat-room-updated", (e) => {
    const { roomId, content, createdAt } = e.detail;
    const room = rooms.value.find(r => r.roomId === roomId);
    if (room) {
      room.lastMessage = content;
      room.lastMessageTime = createdAt;
    }
  });

  // 읽음 처리
  window.addEventListener("chat-read", (e) => {
    const roomId = e.detail;
    const target = rooms.value.find(r => r.roomId === roomId);
    if (target) target.unreadCount = 0;
  });

  // 최소화 창인 경우 안읽음 처리
  window.addEventListener("chat-room-unread", (e) => {
    const { roomId } = e.detail;
    const room = rooms.value.find(r => r.roomId === roomId);
    if (room) {
      room.unreadCount = (room.unreadCount || 0) + 1;
    }
  });
});
</script>

<style scoped>
.chat-card {
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;
}

.chat-card:hover {
  background-color: #f1f5ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>

<style>
.unread-badge {
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 3px 6px;
  min-width: 20px;
  text-align: center;
  line-height: 1;
  display: inline-flex;        /* flex로 바꿔서 정렬 정확히 */
  align-items: center;         /* 수직 가운데 정렬 */
  justify-content: center;     /* 텍스트 수평 가운데 정렬 */
  vertical-align: middle;      /* 주변 텍스트 기준으로 가운데 */
  margin-right: 6px;       /* 시간과 간격 조금 띄움 */
  transform: translateY(2px);
}
</style>
