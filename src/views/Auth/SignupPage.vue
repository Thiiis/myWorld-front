<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-4" 
       style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);">
    
    <!-- 배경 장식 -->
      <!-- 배경 장식 -->
    <div class="position-fixed top-0 start-0 w-100 h-100 overflow-hidden" style="pointer-events: none;">
      <div class="position-absolute text-primary opacity-25" style="top: 40px; left: 40px;">
        <i class="bi bi-cloud" style="font-size: 3rem;"></i>
      </div>
      <div class="position-absolute text-info opacity-25" style="top: 128px; right: 64px;">
        <i class="bi bi-water" style="font-size: 2.2rem;"></i>
      </div>
      <div class="position-absolute text-primary opacity-25" style="bottom: 96px; left: 64px;">
        <i class="bi bi-cloud" style="font-size: 2.5rem;"></i>
      </div>
    </div>

    <div class="w-100 position-relative" style="max-width: 500px; z-index: 10;">
      <!-- 뒤로가기 버튼 -->
      <button
        @click="$emit('back-to-landing')"
        class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 px-4 py-2 pixel-font">
        <i class="bi bi-arrow-left"></i>
        돌아가기
      </button>
        <!-- 상단 헤더 -->
      <div class="text-center mb-4">
        <div class="d-flex align-items-center justify-content-center gap-3 mb-4">
          <div class="d-flex align-items-center justify-content-center rounded-3 shadow-lg" 
               style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--maintheme), var(--river-blue));">
            <i class="bi bi-star-fill text-white"></i>
          </div>
          <h1 class="display-6 pixel-font text-primary mb-0" style="letter-spacing: 1.5px;">
            마이월드
          </h1>
        </div>
        <p class="small english-pixel text-muted" style="letter-spacing: 0.5px;">
          ☁️ JOIN OUR SKY WORLD ☁️
        </p>
      </div>
  <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
    <div class="card-body p-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">

      <div class="text-center mb-4">
        <h2 class="h4 pixel-font text-primary d-flex align-items-center justify-content-center gap-2"
          style="letter-spacing: 1px;">
          <i class="bi bi-person-plus"></i>
          회원가입
          <i class="bi bi-person-plus"></i>
        </h2>
        <hr class="border-primary opacity-25 my-3">
      </div>
      <!-- 에러 메시지 -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show pixel-font" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
      </div>
      <form @submit.prevent="handleSignup" class="mx-auto" style="max-width: 400px;">
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 아이디 (ID)</label>
          <input type="text" class="form-control" v-model="signupForm.account" placeholder="영문, 숫자 조합 (4-20자)" />
        </div>
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 비밀번호 (PASSWORD)</label>
          <input type="password" class="form-control" v-model="signupForm.pwd" placeholder="영문, 숫자 조합 (6자 이상)" />
        </div>
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 비밀번호 확인</label>
          <input type="password" class="form-control" v-model="signupForm.pwdConfirm" placeholder="비밀번호 확인" />
        </div>
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 닉네임 (NICKNAME)</label>
          <input type="text" class="form-control" v-model="signupForm.nickname" placeholder="닉네임 입력" />
        </div>
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 이메일 (EMAIL)</label>
          <input type="email" class="form-control" v-model="signupForm.email" placeholder="example@email.com" />
        </div>
        <div class="mb-3">
          <label for class="form-label pixel-font fw-bold text-dark">☁️ 생년월일 (BIRTHDATE)</label>
          <input type="text" class="form-control" v-model="signupForm.birthdate" placeholder="1998-12-26" />
        </div>
        <button type="submit" class="btn btn-primary w-100"
          style="font-size: 1rem; letter-spacing: 1px; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);">☁️ 회원가입 완료
          ☁️</button>
        <button type="button" class="btn btn-white w-100 mt-2" @click="$router.push('/login')"
          style="font-size: 1rem; letter-spacing: 1px; border-width: 2px; background-color: rgba(59, 130, 246, 0.1);">
          💙 이미 계정이 있나요? 로그인 💙
        </button>
      </form>
      <div class="mt-4 text-center">
        <p class="small english-pixel text-muted" style="letter-spacing: 0.5px;">
          ☁️ CREATE YOUR SKY WORLD ☁️
        </p>
      </div>
    </div>
    </div>
    </div>
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

<style scoped>
.pixel-font,
* {
  font-family: 'DungGeunMo', sans-serif !important;
}

.english-pixel {
  font-family: 'Upheaval', sans-serif !important;
}

.btn:hover {
  transform: scale(1.05);
}

.form-control:focus {
  border-color: var(--maintheme);
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
  transform: scale(1.02);
}

.alert {
  border-radius: 12px;
}

.card {
  backdrop-filter: blur(10px);
}
</style>