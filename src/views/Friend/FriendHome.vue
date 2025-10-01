<template>
  <div class="friends-container">
    <h3 class="mb-4">친구 기능</h3>

    <nav class="nav nav-tabs mb-3">
      <RouterLink
        to="/friends/list"
        class="nav-link"
        :class="{ active: $route.path === '/friends/list' }"
      >
        친구 목록
      </RouterLink>
      <RouterLink
        to="/friends/requests"
        class="nav-link"
        :class="{ active: $route.path === '/friends/requests' }"
      >
        친구 요청
      </RouterLink>
      <RouterLink
        to="/friends/add"
        class="nav-link"
        :class="{ active: $route.path === '/friends/add' }"
      >
        친구 찾기
      </RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
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
  background-color: #ffb6c1;
  color: #fff !important;
}
</style>
