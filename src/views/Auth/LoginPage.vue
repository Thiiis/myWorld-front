<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center p-4"
    style="
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
    "
  >
    <div
      class="position-fixed top-0 start-0 w-100 h-100 overflow-hidden"
      style="pointer-events: none"
    >
      </div>

    <div class="w-100 position-relative" style="max-width: 448px; z-index: 10">
      <button
        @click="$emit('back-to-landing')"
        class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 px-4 py-2 pixel-font"
        style="border-radius: 12px; border-width: 2px; transition: all 0.2s"
      >
        <i class="bi bi-arrow-left"></i>
        돌아가기
      </button>

      <div class="text-center mb-4">
        </div>

      <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div
          class="card-body p-4"
          style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
          "
        >
          <div class="text-center mb-4">
            <h2
              class="h4 pixel-font text-primary d-flex align-items-center justify-content-center gap-2"
              style="letter-spacing: 1px"
            >
              <i class="bi bi-cloud"></i>
              로그인
              <i class="bi bi-cloud"></i>
            </h2>
            <hr class="border-primary opacity-25 my-3" />
            <form
              @submit.prevent="handleLogin"
              class="mx-auto"
              style="max-width: 400px"
              novalidate
            >
              <div class="mb-4">
                <label for="id" class="form-label pixel-font fw-bold text-dark"
                  >☁️ 아이디 (ID)</label
                >
                <input
                  type="text"
                  class="form-control pixel-font"
                  placeholder="아이디를 입력해주세요."
                  v-model.trim="loginForm.account"
                  :class="{ 'is-invalid': accountError }"
                  style="
                    border-width: 2px;
                    background-color: #fafafa;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                  "
                />
                <div v-if="accountError" class="invalid-feedback pixel-font">
                  {{ accountError }}
                </div>
              </div>

              <div class="mb-4">
                <label
                  for="password"
                  class="form-label pixel-font fw-bold text-dark"
                  >☁️ 비밀번호 (PASSWORD)</label
                >
                <input
                  type="password"
                  class="form-control pixel-font"
                  placeholder="비밀번호를 입력해주세요."
                  v-model.trim="loginForm.pwd"
                  :class="{ 'is-invalid': passwordError }"
                  style="
                    border-width: 2px;
                    background-color: #fafafa;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                  "
                />
                <div v-if="passwordError" class="invalid-feedback pixel-font">
                  {{ passwordError }}
                </div>
              </div>
              <div class="pt-3">
                <button
                  type="submit"
                  class="btn btn-primary w-100 mt-2"
                  style="
                    background: linear-gradient(135deg, #3b82f6, #1e40af);
                    color: white;
                  "
                >
                  ☁️ 로그인 ☁️
                </button>
                <button
                  type="button"
                  class="btn btn-white w-100 mt-2"
                  style="
                    font-size: 1rem;
                    letter-spacing: 1px;
                    border-width: 2px;
                    background-color: rgba(59, 130, 246, 0.1);
                    transition: all 0.2s;
                  "
                  @click="$router.push('/signup')"
                >
                  💙 회원가입 💙
                </button>
              </div>
            </form>
          </div>

          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS는 변경 사항이 없습니다. */
.pixel-font,
* {
  font-family: "DungGeunMo", sans-serif !important;
}

/* ... (나머지 스타일) ... */

/* ✨ 추가: Bootstrap의 'is-invalid' 클래스가 적용될 때, 피드백 메시지가 보이도록 설정 */
.invalid-feedback {
    display: block;
    text-align: left;
    margin-top: 0.25rem;
    font-size: 0.8rem;
}
</style>

<script setup>
import auth from "@/apis/axiosApi";
import memberApi from "@/apis/memberApi";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

//전역 상태를 읽고 변경하기 위해 Store 얻기
const store = useStore();

//Router 얻기
const router = useRouter();

//상태 정의
const loginForm = ref({
  account: "member1",
  pwd: "123456",
});

// ✨ 변경점 4: 각 입력 필드에 대한 에러 메시지를 저장할 반응형 상태(ref)를 추가합니다.
const accountError = ref("");
const passwordError = ref("");

// ✨ 변경점 5: 유효성 검사를 위한 함수를 정의합니다.
function validateForm() {
  // 이전 에러 메시지 초기화
  accountError.value = "";
  passwordError.value = "";

  let isValid = true;

  // 아이디(account) 유효성 검사
  const accountPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/;
  if (!accountPattern.test(loginForm.value.account)) {
    accountError.value =
      "아이디는 6~10자의 영문 대/소문자, 숫자를 모두 포함해야 합니다.";
    isValid = false;
  }

  // 비밀번호(pwd) 유효성 검사
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
  if (!passwordPattern.test(loginForm.value.pwd)) {
    passwordError.value =
      "비밀번호는 8~15자의 영문 대/소문자, 숫자를 모두 포함해야 합니다.";
    isValid = false;
  }

  return isValid;
}

//이벤트 처리 함수
async function handleLogin() {
  // ✨ 변경점 6: 로그인 요청을 보내기 전에 유효성 검사를 먼저 실행합니다.
  if (!validateForm()) {
    // 유효성 검사에 실패하면 함수 실행을 중단합니다.
    return;
  }

  try {
    const data = structuredClone(loginForm.value);
    const response = await memberApi.memberLogin(data);
    const result = response.data;

    if (response.status === 200) {
      auth.addAuthHeader(result.jwt);

      store.dispatch("saveAuth", {
        mid: result.mid,
        account: result.account,
        jwt: result.jwt,
      });

      const userToStore = {
        mid: result.mid,
        account: result.account,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(userToStore));

      await router.push(`/myworld/${result.account}`);
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.error(error);
  }
}
</script>