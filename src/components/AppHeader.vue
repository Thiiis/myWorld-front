<!--컴포넌트의 UI-->
<template>
  <nav class="navbar bg-dark">
      <RouterLink class="ms-2 navbar-brand" to="/">
        <img src="@/assets/logo.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top">
        <span class="ms-2 text-white">Vue.js</span>
      </RouterLink>
      <div v-if="$store.state.user === ''">
        <!--$는 내장 변수-->
        <button class="btn btn-success btn-sm me-2" @click="handleLogin">로그인</button>
      </div>
      <div v-if="$store.state.user !== ''">
        <span class="text-white me-2">User: {{ $store.state.user }}</span> 
        <button class="btn btn-info btn-sm me-2" @click="handleLogout">로그아웃</button>
      </div>
  </nav>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

async function handleLogin() {
  await router.push("/Ch08RestAPI/Exam02Login");
}

function handleLogout() {
  store.dispatch("removeAuth");
}

</script>

<!--컴포넌트의 스타일 정의-->
<style scoped></style>

