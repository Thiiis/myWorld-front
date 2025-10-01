<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">회원가입</h2>
    <form class="mx-auto" style="max-width: 400px;" @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">아이디</label>
        <input type="text" id="account" class="form-control" v-model="member.account" placeholder="아이디 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호</label>
        <input type="password" id="pwd" class="form-control" v-model="member.pwd" placeholder="비밀번호 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호 확인</label>
        <input type="password" id="pwdConfirm" class="form-control" v-model="member.pwdConfirm" placeholder="비밀번호 확인" />
      </div>
      <div class="mb-3">
        <label class="form-label">닉네임</label>
        <input type="text" id="nickname" class="form-control" v-model="member.nickname" placeholder="닉네임 입력" />
      </div>
      <div class="mb-3">
        <label class="form-label">이메일</label>
        <input type="email" id="email" class="form-control" v-model="member.email" placeholder="example@email.com" />
      </div>
      <div class="mb-3">
        <label class="form-label">생년월일</label>
        <input type="text" id="birthdate" class="form-control" v-model="member.birthdate" placeholder="1998-12-26" />
      </div>
        <button type="submit" class="btn btn-primary w-100">가입하기</button>
    <hr>
    <h3>[디버깅] 현재 member 객체 상태:</h3>
    <pre>{{ member }}</pre>
    </form>
    <button type="button" class="btn btn-link w-100 mt-2" @click="$router.push('/login')">
      로그인 페이지로 이동
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // 라우터 사용 시
const router = useRouter();
// 폼 데이터를 반응형 객체로 관리합니다.
const member = reactive({
  account: '',
  pwd: '',
  nickname: '',
  email: '',
  birthdate: '',
});

// 비밀번호 확인과 서버 메시지는 별도의 반응형 변수로 관리합니다.
const pwdConfirm = ref('');
const message = ref('');

// 메서드는 일반 함수로 정의합니다.
const submitForm = async () => {
  try {
    // Spring Boot API 엔드포인트로 member 객체를 전송합니다.
    const response = await axios.post(
      'http://localhost:8080/members/signup', // Spring Boot 서버 주소
      member
    );

    // 성공 응답 처리
    alert('회원가입이 완료되었습니다!');
    message.value = response.data; // 성공 메시지 저장 (필요 시)
    router.push('/login'); // 성공 후 로그인 페이지로 이동
  } catch (error) {
    // 💥 이 부분을 수정 또는 강화합니다.
    console.error("전체 에러 객체:", error); // 디버깅을 위해 전체 에러를 콘솔에 출력

    if (error.response && error.response.data) {
      // 서버가 구체적인 에러 데이터를 보냈을 때
      console.log("서버로부터 받은 상세 에러:", error.response.data);

      // Spring Boot의 유효성 검사 에러 배열이 있는지 확인
      const serverErrors = error.response.data.errors;
      if (serverErrors && serverErrors.length > 0) {
        // 첫 번째 에러 메시지를 화면에 표시
        message.value = serverErrors[0].defaultMessage;
      } else {
        // 'errors' 배열이 없는 다른 형태의 에러 메시지일 경우
        message.value = error.response.data.message || '알 수 없는 오류가 발생했습니다.';
      }

    } else {
      // 서버로부터 응답 자체가 오지 않은 경우 (네트워크 문제 등)
      message.value = '서버와 통신할 수 없습니다.';
    }
  }
};
</script>
