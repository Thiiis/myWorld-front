<template>

    <nav class="nav nav-tabs mb-3">
      <!-- to 경로를 account를 동적으로 넣어주도록 변경 -->
      <RouterLink
        :to="`/myworld/${account}/friends/list`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/list` }"
      >
        <i class="bi bi-people"></i> 친구 목록
      </RouterLink>

      <RouterLink
        v-if="isMyPage"
        :to="`/myworld/${account}/friends/requests`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/requests` }"
      >
        <i class="bi bi-person-plus"></i> 친구 요청
      </RouterLink>

      <RouterLink
        :to="`/myworld/${account}/friends/add`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/add` }"
      >
        <i class="bi bi-search"></i> 친구 찾기
      </RouterLink>

      <RouterLink
        v-if="isMyPage"
        :to="`/myworld/${account}/friends/chatList`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/chatList` }"
      >
        <i class="bi bi-chat"></i> 채팅 목록
        <span v-show="totalUnread > 0" key="badge" class="unread-badge ms-1">{{ totalUnread }}</span>
      </RouterLink>
    </nav>

    <RouterView />

</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import chatApi from '@/apis/chatApi'

const route = useRoute()
const store = useStore()

// 현재 URL의 :account 값을 가져와서 동적으로 사용
const account = computed(() => route.params.account)

// 로그인한 사용자 계정
const myAccount = computed(() => store.state.account)

// 본인 페이지인지 확인
const isMyPage = computed(() => account.value === myAccount.value)

const totalUnread = ref(0);

// 안 읽은 메시지 수 불러옴
async function fetchTotalUnread() {
  try {
    const res = await chatApi.getRooms();
    const rooms = res.data || [];
    totalUnread.value = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);
  } catch (e) {
    console.error("총 안읽은 개수 조회 실패:", e);
  }
}

onMounted(() => {
  // 페이지 들어올 때 백엔드 기준으로 초기화
  fetchTotalUnread();

  // ChatRoomList.vue에서 업데이트 이벤트 수신
  window.addEventListener("update-total-unread", async (e) => {
    totalUnread.value = e.detail;
    await nextTick();
  });
});

onBeforeUnmount(() => {
  // 이벤트 중복 방지
  window.removeEventListener("update-total-unread", () => {});
});
</script>

<style scoped>
.nav-link {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-weight: 500;
  color: #495057;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 5px;
}
.nav-link.hover {
  background: #e9ecef;
  text-decoration: none;
  color: #0d6efd;
}
.nav-link.active {
  background-color: #fff;
  color: #0d6efd;
  font-weight: 600;
  box-shadow: 2px 1px 3px rgba(0,0,0,0.08);
}
</style>
