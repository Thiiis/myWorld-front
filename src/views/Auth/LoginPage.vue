<template>   
  <div class="container py-5 position-relative">
    <div class="w-full max-w-md relative z-10">
      <h2 class="text-center mb-4">☁️ 로그인 ☁️</h2>
      <!-- Optional background elements (clouds, waves, etc.) could go here -->
      </div>
    <div class="rounded-2xl p-8 shadow-xl backdrop-blur-sm">
      <!-- Displaying error message if any -->
        <div v-if="error" class="bg-red-100 text-red-800 p-2 rounded-lg mb-6">{{ error }}</div>
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="mx-auto" style="max-width: 400px;">
          <div class="mb-3">
            <label for="id" class="form-label" >☁️ 아이디 (ID)</label>
            <input type="text" class="form-control" placeholder="아이디를 입력해주세요." v-model="loginForm.account" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">☁️ 비밀번호 (PASSWORD)</label>
            <input type="password" class="form-control" placeholder="비밀번호를 입력해주세요." v-model="loginForm.pwd"/>
          </div>
          <div>
          <button type="submit"
                  class="btn btn-primary w-100"
                  style="background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white;">
                  ☁️ 로그인 ☁️</button>
          <button type="button" class="btn btn-white w-100 mt-2"
                  style="background-color: rgba(59, 130, 246, 0.1); color: #1E40AF;" @click="$router.push('/signup')">
                  💙 회원가입 💙</button>
                  </div>
          </form>
      </div>
  </div>
</template>

<style scoped>
.container {
  position: relative; /* 부모 요소에 position: relative 설정 */
  height: 100vh; /* 화면 전체 높이 */
}

.container .bi-cloud {
  position: absolute;
  top: 10%; /* 화면 상단에서 10% 위치 */
  left: 10%; /* 화면 왼쪽에서 10% 위치 */
  color: rgba(255, 255, 255, 0.3); /* 아이콘 색상 설정 */
}

.container .bi-water {
  position: absolute;
  top: 50%; /* 화면 상단에서 50% 위치 */
  right: 10%; /* 화면 오른쪽에서 10% 위치 */
  color: rgba(0, 0, 255, 0.3); /* 아이콘 색상 설정 */
}
</style>

<script setup>
import auth from '@/apis/axiosApi';
import memberApi from '@/apis/memberApi';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

//전역 상태를 읽고 변경하기 위해 Store 얻기
const store = useStore();

//Router 얻기
const router = useRouter();

//상태 정의
const loginForm = ref({
  account: "member1",
  pwd: "123456"
})

//이벤트 처리 함수
async function handleLogin() {
  try {
    const data = structuredClone(loginForm.value);
    const response = await memberApi.memberLogin(data);
    const result = response.data;

    if (response.status === 200) {
      // 2. 서버로부터 받은 JWT 토큰을 전역 axios 설정에 추가합니다.
      // 이제부터 모든 axios 요청에 자동으로 인증 헤더가 포함됩니다.
      auth.addAuthHeader(result.jwt);

      // 3. Vuex 상태를 업데이트합니다. (기존 코드)
      store.dispatch("saveAuth", {
        mid: result.mid,
        account: result.account,
        jwt: result.jwt
      });
      
      // ✨ 중요: ProfileView.vue에서 '수정' 버튼을 표시하려면
      // localStorage에도 로그인 정보가 필요합니다.
      // Vuex의 saveAuth 액션 안에서 이 작업을 하거나, 아래 코드를 직접 추가할 수 있습니다.
      const userToStore = {
        mid: result.mid,
        account: result.account
      };
      localStorage.setItem('loggedInUser', JSON.stringify(userToStore));


      await router.push(`/myworld/${result.account}`);
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}

</script>