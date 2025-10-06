<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
    <div class="container d-flex justify-content-between align-items-center">
      <RouterLink to="/" class="navbar-brand fw-bold text-primary d-flex align-items-center">
        <i class="bi bi-star-fill me-2"></i>
        마이월드
      </RouterLink>

      <div v-if="isLoggedIn" class="d-flex align-items-center">
        <span class="navbar-text me-3">
          <strong>{{ userAccount }}</strong>님 환영합니다!
        </span>
        
        <button @click="handleLogout" class="btn btn-outline-primary btn-sm">
          로그아웃
        </button>
      </div>

      <div v-else>
          <RouterLink to="/login" class="btn btn-primary btn-sm">
            로그인
          </RouterLink>
        </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

// state.jwt에 값이 있으면 true, 없으면 false를 반환하여 로그인 상태를 판단합니다.
const isLoggedIn = computed(() => store.state.jwt !== "" && store.state.jwt != null);

// state.account 값을 가져옵니다.
const userAccount = computed(() => store.state.account);

function handleLogout() {
  // store의 `removeAuth` 액션을 호출합니다.
  store.dispatch('removeAuth');
  
  alert('로그아웃 되었습니다.');
  router.push('/');
}
</script>

<style scoped>
/* navbar-text의 기본 색상이 너무 연해서 잘 보이도록 수정 */
.navbar-text {
  color: rgba(0, 0, 0, 0.7);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
}
</style>