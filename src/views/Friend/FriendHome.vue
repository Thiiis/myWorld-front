<template>
  <div class="friends-container">
    <h3 class="mb-4">친구 기능</h3>

    <nav class="nav nav-tabs mb-3">
      <!-- ✅ to 경로를 account를 동적으로 넣어주도록 변경 -->
      <RouterLink
        :to="`/myworld/${account}/friends/list`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/list` }"
      >
        친구 목록
      </RouterLink>
      <RouterLink
        :to="`/myworld/${account}/friends/requests`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/requests` }"
      >
        친구 요청
      </RouterLink>
      <RouterLink
        :to="`/myworld/${account}/friends/add`"
        class="nav-link"
        :class="{ active: $route.path === `/myworld/${account}/friends/add` }"
      >
        친구 찾기
      </RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// ✅ 현재 URL의 :account 값을 가져와서 동적으로 사용
const account = computed(() => route.params.account)
</script>

<style scoped>
.friends-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  min-height: 70vh;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.nav-link.active {
  background-color: #0d6efd;
  color: #fff !important;
}
</style>
