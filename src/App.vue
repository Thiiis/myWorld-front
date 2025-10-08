<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader />
    <RouterView />

    <!-- 하단 채팅창 -->
    <div class="chat-container">
      <ChatBox
        v-for="room in openRooms"
        :key="room.id"
        :room-id="room.id"
        :friend="room.friend"
        @close="closeRoom(room.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import ChatBox from './views/Chat/ChatBox.vue';

const store = useStore();

const openRooms = computed(() => store.state.chat.openRooms);

function closeRoom(roomId) {
  store.commit("chat/removeOpenRoom", roomId);
}

// 핵심 추가점: 앱이 생성된 후, 마운트되기 전에 loadAuth 액션을 호출합니다.
// 이렇게 하면 새로고침 시 localStorage의 인증 정보를 Vuex state로 복원할 수 있습니다.
store.dispatch('loadAuth');
</script>

<style>
/* 헤더 높이만큼 본문을 아래로 밀기 */
body {
  padding-top: 70px;
}
/* 하단 채팅창 컨테이너 */
.chat-container {
  position: fixed;
  bottom: 0;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1050;
}
</style>
