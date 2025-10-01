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
      //로그 나중에 삭제
      console.log("mid:", result.mid);
      console.log("account:", result.account);
      console.log("jwt:", result.jwt);

      store.dispatch("saveAuth", {
        mid: result.mid,
        account: result.account,
        jwt: result.jwt
      });

      await router.push(`/myworld/${result.account}`);
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}

</script>