<template>
  <div
    class="card chat-box shadow-sm"
    style="width: 400px; height: 400px; position: fixed; bottom: 0; right: 20px; resize: both; overflow: hidden;"
    ref="chatBox"
  >
    <!-- 드래그 핸들 -->
    <div
      class="card-header d-flex justify-content-between align-items-center"
      @mousedown="startDrag"
      style="cursor: move;"
    >
      <strong>채팅방 ({{ roomTitle }})</strong>
      <button class="btn-close" @click="$emit('close', roomId)"></button>
    </div>

    <div class="card-body overflow-auto">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="mb-2 d-flex align-items-start"
        :class="{ 'justify-content-end': m.senderAccount === myAccount }"
      >
        <!-- 상대방 메시지 -->
        <template v-if="m.senderAccount !== myAccount">
          <img
            :src="m.senderProfileImg ? backendUrl + m.senderProfileImg : defaultProfile"
            class="rounded-circle me-2"
            style="width:30px;height:30px;object-fit:cover"
          />
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

    <div class="card-footer d-flex">
      <input
        v-model="newMsg"
        @keyup.enter="sendMsg"
        class="form-control me-2"
        placeholder="메시지를 입력하세요"
      />
      <button class="btn btn-primary btn-sm" style="flex:0 0 auto; min-width:60px" @click="sendMsg">전송</button>
    </div>
  </div>
</template>

<script setup>
import { Client } from "@stomp/stompjs";
import chatApi from "@/apis/chatApi";
import defaultProfile from "@/assets/image/default-profile.png";
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps({ roomId: { type: Number, required: true } });

const backendUrl = "http://localhost:8080";
const router = useRouter();
const store = useStore();

const token = computed(() => store.state.jwt);
const myAccount = computed(() => store.state.account);

const messages = ref([]);
const newMsg = ref("");
const client = ref(null);
const isDragging = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const roomTitle = ref(""); // 방 제목(상대방 닉네임)

// --- 기존 채팅 기록 불러오기 ---
async function loadHistory() {
  try {
    const res = await chatApi.getMessages(props.roomId);
    const data = res.data;
    messages.value = data;

    // 상대방 닉네임으로 채팅방 제목 설정
    const otherUsers = data
      .map((m) => m.senderNickname)
      .filter((name, idx, arr) => name && arr.indexOf(name) === idx);
    roomTitle.value =
      otherUsers.length > 0 ? otherUsers.join(", ") : `#${props.roomId}`;
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
      messages.value.push(JSON.parse(msg.body));
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

function scrollToBottom() {
  const box = document.querySelector(".card-body");
  if (box) box.scrollTop = box.scrollHeight;
}

// --- 미니홈으로 이동 ---
function goMinihome(account) {
  if (account) router.push(`/myworld/${account}`);
}

// --- 드래그 이동 로직 ---
function startDrag(e) {
  const box = e.currentTarget.closest(".chat-box");
  isDragging.value = true;
  offsetX.value = e.clientX - box.getBoundingClientRect().left;
  offsetY.value = e.clientY - box.getBoundingClientRect().top;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}
function onDrag(e) {
  if (!isDragging.value) return;
  const box = document.querySelector(".chat-box");
  box.style.left = e.clientX - offsetX.value + "px";
  box.style.top = e.clientY - offsetY.value + "px";
  box.style.bottom = "auto";
  box.style.right = "auto";
  box.style.position = "fixed";
}
function stopDrag() {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

onMounted(async () => {
  await loadHistory();
  nextTick(scrollToBottom);
  connect();
});
onBeforeUnmount(() => {
  if (client.value) client.value.deactivate();
});
</script>

<style scoped>
.chat-box .card-body {
  height: calc(100% - 90px); /* 헤더 + 푸터 영역 제외 */
  overflow-y: auto;
}

</style>
