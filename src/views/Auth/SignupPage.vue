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

    <div class="w-100 position-relative" style="max-width: 500px; z-index: 10">
      <button
        @click="$emit('back-to-landing')"
        class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 px-4 py-2 pixel-font"
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
              <i class="bi bi-person-plus"></i>
              회원가입
              <i class="bi bi-person-plus"></i>
            </h2>
            <hr class="border-primary opacity-25 my-3" />
          </div>

          <form
            @submit.prevent="handleSignup"
            class="mx-auto"
            style="max-width: 400px"
            novalidate
          >
            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 아이디 (ID)</label
              >
              <input
                type="text"
                class="form-control"
                v-model.trim="signupForm.account"
                :class="{ 'is-invalid': errors.account }"
                placeholder="영문, 숫자 조합 (4-20자)"
              />
              <div v-if="errors.account" class="invalid-feedback">
                {{ errors.account }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 비밀번호 (PASSWORD)</label
              >
              <input
                type="password"
                class="form-control"
                v-model.trim="signupForm.pwd"
                :class="{ 'is-invalid': errors.pwd }"
                placeholder="영문, 숫자 조합 (6자 이상)"
              />
              <div v-if="errors.pwd" class="invalid-feedback">
                {{ errors.pwd }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 비밀번호 확인</label
              >
              <input
                type="password"
                class="form-control"
                v-model.trim="signupForm.pwdConfirm"
                :class="{ 'is-invalid': errors.pwdConfirm }"
                placeholder="비밀번호 확인"
              />
              <div v-if="errors.pwdConfirm" class="invalid-feedback">
                {{ errors.pwdConfirm }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 닉네임 (NICKNAME)</label
              >
              <input
                type="text"
                class="form-control"
                v-model.trim="signupForm.nickname"
                :class="{ 'is-invalid': errors.nickname }"
                placeholder="닉네임 입력 (2-10자)"
              />
              <div v-if="errors.nickname" class="invalid-feedback">
                {{ errors.nickname }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 이메일 (EMAIL)</label
              >
              <input
                type="email"
                class="form-control"
                v-model.trim="signupForm.email"
                :class="{ 'is-invalid': errors.email }"
                placeholder="example@email.com"
              />
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label pixel-font fw-bold text-dark"
                >☁️ 생년월일 (BIRTHDATE)</label
              >
              <input
                type="text"
                class="form-control"
                v-model.trim="signupForm.birthdate"
                :class="{ 'is-invalid': errors.birthdate }"
                placeholder="1998-12-26"
              />
              <div v-if="errors.birthdate" class="invalid-feedback">
                {{ errors.birthdate }}
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
              style="
                font-size: 1rem;
                letter-spacing: 1px;
                box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
              "
            >
              ☁️ 회원가입 완료 ☁️
            </button>
            <button
              type="button"
              class="btn btn-white w-100 mt-2"
              @click="$router.push('/login')"
              style="
                font-size: 1rem;
                letter-spacing: 1px;
                border-width: 2px;
                background-color: rgba(59, 130, 246, 0.1);
              "
            >
              💙 이미 계정이 있나요? 로그인 💙
            </button>
          </form>
          <div class="mt-4 text-center">
            <p
              class="small english-pixel text-muted"
              style="letter-spacing: 0.5px"
            >
              ☁️ CREATE YOUR SKY WORLD ☁️
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import memberApi from "@/apis/memberApi"; // API 모듈 임포트
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const signupForm = ref({
  account: "",
  pwd: "",
  pwdConfirm: "",
  nickname: "",
  email: "",
  birthdate: "",
});

// ✨ 변경점 3: 에러 메시지를 한 번에 관리할 반응형 객체를 생성합니다.
const errors = ref({});

// ✨ 변경점 4: 유효성 검사 로직을 포함하는 함수를 정의합니다.
function validateForm() {
  // 이전 에러 메시지를 초기화합니다.
  errors.value = {};

  // 각 필드에 대한 정규식 패턴
  const accountPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;
  const pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const nicknamePattern = /^.{2,10}$/;
  const emailPattern =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  const birthdatePattern = /^\d{4}-\d{2}-\d{2}$/;

  // 유효성 검사 시작
  if (!accountPattern.test(signupForm.value.account)) {
    errors.value.account = "아이디는 4~20자의 영문과 숫자를 포함해야 합니다.";
  }
  if (!pwdPattern.test(signupForm.value.pwd)) {
    errors.value.pwd = "비밀번호는 6자 이상의 영문과 숫자를 포함해야 합니다.";
  }
  if (signupForm.value.pwd !== signupForm.value.pwdConfirm) {
    errors.value.pwdConfirm = "비밀번호가 일치하지 않습니다.";
  }
  if (!nicknamePattern.test(signupForm.value.nickname)) {
    errors.value.nickname = "닉네임은 2자 이상 10자 이하로 입력해주세요.";
  }
  if (!emailPattern.test(signupForm.value.email)) {
    errors.value.email = "유효한 이메일 주소를 입력해주세요.";
  }
  if (!birthdatePattern.test(signupForm.value.birthdate)) {
    errors.value.birthdate = "생년월일을 YYYY-MM-DD 형식으로 입력해주세요.";
  }

  // errors 객체에 키가 하나라도 있으면 유효성 검사 실패
  return Object.keys(errors.value).length === 0;
}

async function handleSignup() {
  // ✨ 변경점 5: API 요청 전에 유효성 검사를 실행합니다.
  if (!validateForm()) {
    return; // 유효성 검사 실패 시 함수 종료
  }

  try {
    const { pwdConfirm, ...dataToSend } = structuredClone(signupForm.value);

    const response = await memberApi.memberSignup(dataToSend);

    if (response.status === 200) {
      alert("회원가입이 성공적으로 완료되었습니다.");
      await router.push("/login");
    } else {
      alert(response.data.message || "회원가입에 실패했습니다.");
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
  }
}
</script>

<style scoped>
/* CSS는 이전과 거의 동일합니다. */
.pixel-font,
* {
  font-family: "DungGeunMo", sans-serif !important;
}

.english-pixel {
  font-family: "Upheaval", sans-serif !important;
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

/* ✨ 추가: 에러 메시지가 잘 보이도록 스타일을 추가합니다. */
.invalid-feedback {
  display: block;
  text-align: left;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #dc3545; /* Bootstrap의 danger color */
}
</style>