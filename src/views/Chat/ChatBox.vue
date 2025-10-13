<template>
  <div class="card chat-box shadow-sm" :class="{ minimized: isMinimized }" :style="boxStyle" ref="chatBox">
    <!-- 드래그 핸들 -->
    <div class="card-header d-flex justify-content-between align-items-center" @mousedown="startDrag" style="cursor: move;">
      <strong>채팅방 ({{ roomTitle }})
        <span v-if="unreadCount > 0" class="unread-badge ms-2">{{ unreadCount }}</span>
      </strong>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-minimize" @click="toggle">
          <i class="bi" :class="isMinimized ? 'bi-plus-lg' : 'bi-dash-lg'" style="color: #212529; font-size: 1.4rem;"></i>
        </button>
        <button class="btn-close" style="transform: scale(0.8);" @click="$emit('close', roomId)"></button>
      </div>
    </div>

    <div v-show="!isMinimized" class="card-body overflow-auto" ref="chatBody">
      <div v-for="(m, i) in messages" :key="i" class="mb-2 d-flex align-items-start" :class="{ 'justify-content-end': m.senderAccount === myAccount }">
        <!-- 상대방 메시지 -->
        <template v-if="m.senderAccount !== myAccount">
          <img :src="m.senderProfileImg ? backendUrl + m.senderProfileImg : defaultProfile" class="rounded-circle me-2" style="width:30px;height:30px;object-fit:cover" />
          <div style="display: inline-block;">
            <div>
              <strong @click="goMinihome(m.senderAccount)" style="cursor:pointer">
                {{ m.senderNickname }}
              </strong>
            </div>
            <div class="p-2 bg-light rounded" style="display: inline-block; word-wrap: break-word;">
              {{ m.content }}
            </div>
          </div>
        </template>

        <!-- 내가 보낸 메시지 -->
        <template v-else>
          <div>
            <div class="p-2 bg-primary text-white rounded" style="display: inline-block; word-wrap: break-word;">
              {{ m.content }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-show="!isMinimized" class="card-footer d-flex">
      <input v-model="newMsg" @keyup.enter="sendMsg" class="form-control me-2" placeholder="메시지를 입력하세요" />
      <button class="btn btn-primary btn-sm" style="flex:0 0 auto; min-width:60px" @click="sendMsg">
        전송
      </button>
    </div>
  </div>
</template>

<script setup>
import { Client } from "@stomp/stompjs";
import chatApi from "@/apis/chatApi";
import defaultProfile from "@/assets/image/default-profile.png";
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({
  roomId: { type: Number, required: true },
  index: { type: Number, required: false, default: 0 },
  friend: { type: Object, required: false, default: null }
});

const backendUrl = "http://localhost:8080";
const router = useRouter();
const store = useStore();

const token = computed(() => store.state.jwt);
const myAccount = computed(() => store.state.account);

const messages = ref([]);
const newMsg = ref("");
const client = ref(null);
const roomTitle = ref(""); // 방 제목(sender 닉네임)

const isDragging = ref(false);
const isMinimized = ref(false);
const boxWidth = ref(400);
const boxHeight = ref(400);
const boxLeft = ref(null);
const boxTop = ref(null);
const offsetX = ref(0);
const offsetY = ref(0);
const prevLeft = ref(null);
const prevTop = ref(null);
const prevWidth = ref(400);
const prevHeight = ref(400);

const chatBox = ref(null);
const unreadCount = ref(0);

// 박스 스타일 계산
const boxStyle = computed(() => ({
  width: boxWidth.value + "px",
  height: isMinimized.value ? "auto" : boxHeight.value + "px",
  position: "fixed",
  bottom: boxTop.value ? "auto" : `${10 + (props.index ?? 0) * 10}px`,
  right: boxLeft.value ? "auto" : `${20 + (props.index ?? 0) * 8}px`,
  top: boxTop.value ? boxTop.value + "px" : "auto",
  left: boxLeft.value ? boxLeft.value + "px" : "auto",
  resize: isMinimized.value ? "none" : "both",
  overflow: "hidden",
}));

// --- 기존 채팅 기록 불러오기 ---
async function loadHistory() {
  try {
    const res = await chatApi.getMessages(props.roomId);
    messages.value = res.data;

    // 상대방 닉네임으로 채팅방 제목 설정
    if (props.friend && props.friend.nickname) {
      roomTitle.value = props.friend.nickname;
    } else {
      const otherUsers = messages.value
        .map((m) => m.senderNickname)
        .filter((name, idx, arr) => name && arr.indexOf(name) === idx);
      roomTitle.value =
        otherUsers.length > 0 ? otherUsers.join(", ") : `#${props.roomId}`;
    }
  } catch (e) {
    console.error("기존 메시지 로딩 실패:", e);
  }
}

// --- STOMP 연결 ---
function connect() {
  client.value = new Client({
    brokerURL: `ws://localhost:8080/ws?jwt=${token.value}`,
  });
  client.value.onConnect = () => {
    // 메시지 수신
    client.value.subscribe(`/topic/rooms/${props.roomId}`, (msg) => {
      const data = JSON.parse(msg.body);
      messages.value.push(data);

      // 최소화된 상태면 안읽음 이벤트 발생
  if (isMinimized.value && data.senderAccount && data.senderAccount !== myAccount.value) {
    window.dispatchEvent(
      new CustomEvent("chat-room-unread", {
        detail: { roomId: props.roomId },
      })
    );
  }

  // 열려있는 상태면 읽음 이벤트 발생
  else if (!isMinimized.value && data.senderAccount !== myAccount.value) {
    store.commit("chat/clearUnread", props.roomId);
    window.dispatchEvent(new CustomEvent("chat-read", { detail: props.roomId }));
  }

  // 마지막 메시지 업데이트
  window.dispatchEvent(
    new CustomEvent("chat-room-updated", {
      detail: {
        roomId: props.roomId,
        content: data.content,
        createdAt: data.createdAt,
      },
    })
  );
      nextTick(scrollToBottom);
    });
  };
  client.value.activate();
}

// --- 메시지 전송 ---
function sendMsg() {
  if (!newMsg.value) return;
  client.value.publish({
    destination: `/app/chat.send.${props.roomId}`,
    body: JSON.stringify({ content: newMsg.value }),
  });
  newMsg.value = "";
  nextTick(scrollToBottom);
}

// --- 채팅방 스크롤 하단으로 ---
const chatBody = ref(null);

function scrollToBottom() {
  const box = chatBody.value;
  if (box) {
    box.scrollTop = box.scrollHeight;
  }
}

// --- 미니홈으로 이동 ---
function goMinihome(account) {
  if (account) router.push(`/myworld/${account}`);
}

// --- 드래그 이동 로직 ---
function startDrag(e) {
  const box = e.currentTarget.closest(".chat-box");
  isDragging.value = true;
  const rect = box.getBoundingClientRect();
  offsetX.value = e.clientX - rect.left;
  offsetY.value = e.clientY - rect.top;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(e) {
  if (!isDragging.value) return;

  boxLeft.value = e.clientX - offsetX.value;
  boxTop.value = e.clientY - offsetY.value;
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

// --- 최소화/확대 토글 ---
async function toggle() {
  isMinimized.value = !isMinimized.value;

  if (isMinimized.value) {
    // 최소화 전 상태 백업
    prevLeft.value = boxLeft.value;
    prevTop.value = boxTop.value;
    prevWidth.value = boxWidth.value;
    prevHeight.value = boxHeight.value;

    // 최소화 시 기본위치로 이동
    boxLeft.value = null;
    boxTop.value = null;
    boxWidth.value = 400;
  } else {
    // 최소화 해제 시 읽음 처리
    store.commit("chat/clearUnread", props.roomId);
    window.dispatchEvent(new CustomEvent("chat-read", { detail: props.roomId }));

    await chatApi.getMessages(props.roomId);

    // 이전 위치 & 크기 복구
    boxLeft.value = prevLeft.value;
    boxTop.value = prevTop.value;
    boxWidth.value = prevWidth.value;
    boxHeight.value = prevHeight.value;
  }
}

function setupResizeObserver() {
  const box = chatBox.value;
  if (!box) return;

  const observer = new ResizeObserver(() => {
    if (!isMinimized.value) { // 최소화 중엔 저장 X
      boxWidth.value = box.offsetWidth;
      boxHeight.value = box.offsetHeight;
    }
  });

  observer.observe(box);
}

onMounted(async () => {
  await loadHistory();
  store.commit("chat/clearUnread", props.roomId);
  //전역 이벤트로 읽음 상태 알림
  window.dispatchEvent(new CustomEvent("chat-read", { detail: props.roomId }));
  nextTick(scrollToBottom);
  connect();
  setupResizeObserver();
  
  // 최소화 상태에서 새 메시지가 왔을 때만 헤더 뱃지 증가
  window.addEventListener("chat-room-unread", (e) => {
    if (e.detail.roomId === props.roomId && isMinimized.value) {
      unreadCount.value++;
    }
  });

  // 최소화 해제 시 뱃지 초기화
  window.addEventListener("chat-read", (e) => {
    if (e.detail === props.roomId) {
      unreadCount.value = 0;
    }
  });
});

onBeforeUnmount(() => {
  store.commit("chat/removeActiveRoom", props.roomId);
  if (client.value) client.value.deactivate();

  window.removeEventListener("chat-room-unread", () => {});
  window.removeEventListener("chat-read", () => {});
});
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
}

.chat-box .card-header {
  flex-shrink: 0;
}

.chat-box .card-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.chat-box .card-footer {
  flex-shrink: 0;
}

.chat-box.minimized .card-body,
.chat-box.minimized .card-footer {
  display: none !important;
}

.btn-minimize {
  background: none;
  border: none;
  padding: 2px;
  opacity: 1;
  transition: opacity 0.2s;
}

.btn-minimize:hover .bi {
  background: none;
  text-shadow: 0 0 0px #000;
}
</style>