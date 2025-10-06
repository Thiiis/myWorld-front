<template>
  <!-- Bootstrap 3 스타일을 사용한 프로필 조회 UI -->
  <div>
    <div class="profile-section">
      <!-- 1. 로딩 컨테이너: isLoading이 true일 때만 표시 -->
      <div v-if="isLoading" class="loading-container text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">프로필을 불러오는 중...</p>
      </div>
      
      <!-- 2. 프로필 카드: 로딩이 끝났고(false), profileInfo 데이터가 있을 때만 표시 -->
      <div v-if="profile" class="panel panel-default">
        <div class="panel-body">
          <div class="row">
            <!-- 프로필 이미지 -->
            <div class="col-md-3 text-center">
              <img :src="profile.imgUrl ? `${backendUrl}${profile.imgUrl}` : defaultProfile"
                class="img-responsive img-thumbnail" alt="프로필 사진" style="width: 150px; height: 150px; object-fit: cover;">
              <h4 class="dunggeunmo-font" style="margin-top: 15px;">{{ profile.nickname }}</h4>
              <p v-if="profile.statusMessage" class="dunggeunmo-font text-muted">"{{ profile.statusMessage }}"</p>
              <div>
  
              </div>
              <div v-if="isMyProfile" style="margin-top: 10px;">
                <router-link :to="{ name: 'ProfileEdit', params: { account: profile.account } }"
                  class="btn btn-primary btn-sm dunggeunmo-font">
                  프로필 수정
                </router-link>
                <router-link to="/change-password" class="btn btn-default btn-sm dunggeunmo-font"
                  style="margin-left: 5px;">
                  비밀번호 변경
                </router-link>
              </div>
            </div>
            <!-- 프로필 상세 정보 -->
            <div v-if="profile && memberInfo" class="col-md-9">
              <h4 class="dunggeunmo-font"><strong>기본 정보</strong></h4>
              <hr style="margin-top: 10px; margin-bottom: 10px;">
              <dl class="dl-horizontal dunggeunmo-font">
                <dt v-if="memberInfo.account">☺️ 아이디</dt>
                <dd v-if="memberInfo.account">{{ memberInfo.account }}</dd>
              </dl>
              <dl class="dl-horizontal dunggeunmo-font">
                <dt v-if="memberInfo.email">📧 이메일</dt>
                <dd v-if="memberInfo.email">{{ memberInfo.email }}</dd>
              </dl>
              <dl class="dl-horizontal dunggeunmo-font">
                <dt v-if="profile.birthdate">🎂 생년월일</dt>
                <dd v-if="profile.birthdate">{{ profile.birthdate }}</dd>
              </dl>
              <dl class="dl-horizontal dunggeunmo-font">
                <dt v-if="profile.birthdate">🏠 주소</dt>
                <dd v-if="profile.birthdate">{{ profile.mainAddress }}</dd>
              </dl>
              <br>
              <h4 class="dunggeunmo-font"><strong>👍 자기소개</strong></h4>
              <hr style="margin-top: 10px; margin-bottom: 10px;">
              <p v-if="profile.intro" class="dunggeunmo-font" style="white-space: pre-wrap;">{{ profile.intro }}</p>
              <p v-else class="dunggeunmo-font text-muted">작성된 자기소개가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import defaultProfile from '@/assets/image/default-profile.png';
import profileApi from '@/apis/profileApi';
import memberApi from '@/apis/memberApi';

const backendUrl = 'http://kosa164.iptime.org:8080';

const route = useRoute();
const profile = ref(null);
const memberInfo = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isMyProfile = ref(false);

// 1. 프로필 정보를 불러오는 함수
async function loadProfile(account) {
  try {
    const response = await profileApi.getAnotherProfileDetail(account);
    profile.value = response.data;
  } catch (err) {
    console.error("프로필 정보 조회 실패:", err);
  }
}

// 2. 멤버 정보를 불러오는 함수 (API 함수 이름을 `memberInfo`로 수정)
async function loadMember(account) {
  try {
    const response = await memberApi.memberInfo(account); // 👈 핵심 수정 사항
    memberInfo.value = response.data;
  } catch (err) {
    console.error("멤버 정보 조회 실패:", err);
  }
}

onMounted(async () => {
  isLoading.value = true;
  error.value = null; // 초기화

  try {
    const targetAccount = route.params.account;

    // 로그인 정보 확인
    const loggedInUserString = localStorage.getItem('loggedInUser');
    const loggedInUser = JSON.parse(loggedInUserString);
    const loggedInUserAccount = loggedInUser ? loggedInUser.account : null;

    if (targetAccount && loggedInUserAccount && targetAccount === loggedInUserAccount) {
      isMyProfile.value = true;
    }

    // 3. 분리된 함수들을 순차적으로 실행
    // Promise.all을 사용해 두 요청을 동시에 보낼 수도 있습니다.
    await Promise.all([
      loadProfile(targetAccount),
      loadMember(targetAccount)
    ]);

    // 4. 모든 데이터 로딩 시도 후 최종 에러 상태 확인
    if (!profile.value && !memberInfo.value) {
      error.value = "사용자 정보를 불러오는 데 실패했습니다.";
    }

  } catch (err) {
    // localStorage 파싱 오류 등 예외적인 에러 처리
    console.error("초기화 과정에서 오류 발생:", err);
    error.value = "페이지를 로드하는 중 오류가 발생했습니다.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.dunggeunmo-font {
  font-family: 'DungGeunMo', sans-serif;
}

/* --- 로딩 인디케이터 스타일 --- */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  /* 위아래로 충분한 여백을 줍니다. */
  min-height: 250px;
  /* 프로필 카드의 최소 높이와 비슷하게 설정하여 레이아웃 깨짐 방지 */
  background-color: #fff;
  /* 배경을 흰색으로 */
  border-radius: 15px;
  /* 프로필 카드와 동일한 둥근 모서리 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* 은은한 그림자 효과 */
}

/* 스피너 애니메이션의 크기 조절 (선택 사항) */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
