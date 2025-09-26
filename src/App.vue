<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppMenu from './components/MyPageSideBar.vue';
</script>

<style>
/* 헤더 높이만큼 본문을 아래로 밀기 */
body {
  padding-top: 70px;
}
</style>
