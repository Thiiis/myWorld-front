<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">로그인</h2>
    <form @submit.prevent="handleLogin" class="mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">아이디</label>
        <input type="text" class="form-control" placeholder="아이디 입력" v-model="loginForm.account" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호</label>
        <input type="password" class="form-control" placeholder="비밀번호 입력" v-model="loginForm.pwd" />
      </div>
      <button type="submit" class="btn btn-primary w-100">로그인</button>
      <button type="button" class="btn btn-link w-100 mt-2" @click="$router.push('/signup')">
        회원가입 페이지로 이동
      </button>
    </form>
  </div>
</template>

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