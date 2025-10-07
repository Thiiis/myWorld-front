<template>
  <div class="d-flex flex-column vh-100">
    <AppHeader />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppMenu from './components/MyWorldSideBar.vue';
import store from './store' // store import

// ✨ 핵심 추가점: 앱이 생성된 후, 마운트되기 전에 loadAuth 액션을 호출합니다.
// 이렇게 하면 새로고침 시 localStorage의 인증 정보를 Vuex state로 복원할 수 있습니다.
store.dispatch('loadAuth');

</script>

<style>
/* 헤더 높이만큼 본문을 아래로 밀기 */
body {
  padding-top: 70px;
}
</style>
