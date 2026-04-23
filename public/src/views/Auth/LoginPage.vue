<template>   
   <div class="min-vh-100 d-flex align-items-center justify-content-center p-4" 
       style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);">
    
    <!-- 배경 구름/물결 장식 -->
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
      <div class="position-absolute text-info opacity-25" style="bottom: 40px; right: 80px;">
        <i class="bi bi-water" style="font-size: 1.75rem;"></i>
      </div>
      <div class="position-absolute text-primary opacity-25" style="top: 50%; left: 16.66%;">
        <i class="bi bi-cloud" style="font-size: 1.9rem;"></i>
      </div>
      <div class="position-absolute text-info opacity-25" style="top: 25%; right: 25%;">
        <i class="bi bi-water" style="font-size: 1.6rem;"></i>
      </div>
    </div>

    <div class="w-100 position-relative" style="max-width: 448px; z-index: 10;">
      <!-- 뒤로가기 버튼 -->
      <button
        @click="goBackSafely"
        class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 px-4 py-2 pixel-font"
        style="border-radius: 12px; border-width: 2px; transition: all 0.2s;">
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
        ☁️ MODERN SKY & RIVER ☁️
      </p>
    </div>
    <!-- 로그인 폼 -->
      <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div class="card-body p-4" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
          
          <div class="text-center mb-4">
            <h2 class="h4 pixel-font text-primary d-flex align-items-center justify-content-center gap-2" 
                style="letter-spacing: 1px;">
              <i class="bi bi-cloud"></i>
              로그인
              <i class="bi bi-cloud"></i>
            </h2>
            <hr class="border-primary opacity-25 my-3">
            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="mx-auto" style="max-width: 400px;">
              <div class="mb-4">
                  <label for="id" class="form-label pixel-font fw-bold text-dark" >☁️ 아이디 (ID)</label>
                  <input type="text" class="form-control pixel-font" placeholder="아이디를 입력해주세요." v-model="loginForm.account"
                  style="border-width: 2px; background-color: #FAFAFA; font-size: 0.9rem; transition: all 0.2s;"/>
              </div>

              <div class="mb-4">
                  <label for="password" class="form-label pixel-font fw-bold text-dark">☁️ 비밀번호 (PASSWORD)</label>
                  <input type="password" class="form-control pixel-font" placeholder="비밀번호를 입력해주세요." v-model="loginForm.pwd"
                  style="border-width: 2px; background-color: #FAFAFA; font-size: 0.9rem; transition: all 0.2s;"/>
              </div>
              <div class="pt-3">
              <button type="submit"
                      class="btn btn-primary w-100 mt-2"
                      style="background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white;">
                      ☁️ 로그인 ☁️</button>
              <button type="button" class="btn btn-white w-100 mt-2"
                      style="font-size: 1rem; letter-spacing: 1px; border-width: 2px; background-color: rgba(59, 130, 246, 0.1); transition: all 0.2s;" @click="$router.push('/signup')">
                      💙 회원가입 💙</button>
                      </div>
              </form>
          </div>

    <div class="rounded-2xl p-8 shadow-xl backdrop-blur-sm">
      <!-- Displaying error message if any -->
        <!-- 에러 메시지 -->
          <div v-if="error" class="alert alert-danger alert-dismissible fade show pixel-font" role="alert">
            {{ error }}
            <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
          </div>
            <div class="mt-4 text-center">
            <p class="small english-pixel text-muted" style="letter-spacing: 0.5px;">
              ☁️ WELCOME TO MODERN SKY WORLD ☁️
            </p>
          </div>
      </div>
  </div>
  </div>
  </div>
  </div>
</template>

<style scoped>

.pixel-font, * {
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
}

.alert {
  border-radius: 12px;
}

.card {
  backdrop-filter: blur(10px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.floating {
  animation: float 2s ease-in-out infinite;
}
</style>

<script setup>
import auth from '@/apis/axiosApi';
import memberApi from '@/apis/memberApi';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const error = ref("");

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

function goBackSafely() {
  // router.options.history.state.back이 null이면 앱 내의 방문 기록이 없다는 뜻입니다.
  if (router.options.history.state.back) {
    // 앱 내 방문 기록이 있으면 뒤로 갑니다.
    router.back();
  } else {
    // 방문 기록이 없으면 메인 페이지로 이동합니다.
    router.push('/');
  }
}

</script>