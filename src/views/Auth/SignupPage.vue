<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">회원가입</h2>
    <form @submit.prevent="handleSignup" class="mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">아이디</label>
        <input type="text" class="form-control" v-model="signupForm.account" placeholder="아이디 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호</label>
        <input type="password" class="form-control" v-model="signupForm.pwd" placeholder="비밀번호 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호 확인</label>
        <input type="password" class="form-control" v-model="signupForm.pwdConfirm" placeholder="비밀번호 확인" />
      </div>
      <div class="mb-3">
        <label class="form-label">닉네임</label>
        <input type="text" class="form-control" v-model="signupForm.nickname" placeholder="닉네임 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">이메일</label>
        <input type="email" class="form-control" v-model="signupForm.email" placeholder="example@email.com" />
      </div>
      <div class="mb-3">
        <label class="form-label">생년월일</label>
        <input type="text" class="form-control" v-model="signupForm.birthdate" placeholder="1998-12-26" />
      </div>
      <button type="submit" class="btn btn-primary w-100">가입하기</button>
      <button type="button" class="btn btn-link w-100 mt-2" @click="$router.push('/login')">
        로그인 페이지로 이동
      </button>
    </form>
  </div>
</template>

<script setup>
import memberApi from '@/apis/memberApi'; // API 모듈 임포트
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Router 얻기
const router = useRouter();

// 상태 정의 (로그인 컴포넌트와 같이 ref 사용)
const signupForm = ref({
  account: '',
  pwd: '',
  pwdConfirm: '', // 비밀번호 확인 필드 추가
  nickname: '',
  email: '',
  birthdate: '',
});

// 이벤트 처리 함수 (로그인 컴포넌트의 async/await 구조와 동일하게)
async function handleSignup() {
  // 프론트엔드 유효성 검사 (예: 비밀번호 일치)
  if (signupForm.value.pwd.trim() !== signupForm.value.pwdConfirm.trim()) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    // API에 전송할 데이터 준비 (structuredClone으로 깊은 복사)
    // pwdConfirm 필드는 서버에 보낼 필요가 없으므로 제외합니다.
    const { ...dataToSend } = structuredClone(signupForm.value);
    
    // memberApi를 사용하여 회원가입 요청
    const response = await memberApi.memberSignup(dataToSend);

    // 성공적으로 응답(상태 코드 200)을 받았을 경우
    if (response.status === 200) {
      alert('회원가입이 성공적으로 완료되었습니다.');
      await router.push('/login'); // 회원가입 성공 후 로그인 페이지로 이동
    } else {
      // 200 외의 다른 상태 코드를 받았을 경우의 처리 (필요 시)
      console.log(response.data.message || '알 수 없는 응답입니다.');
      alert(response.data.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    // 요청 실패 시 (네트워크 오류, 서버 에러 등)
    console.error(error);
    // 사용자에게 에러 메시지 표시
    alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
  }
}
</script>