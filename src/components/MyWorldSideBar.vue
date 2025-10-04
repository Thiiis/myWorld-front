<template>
  <div>
    <!-- 프로필 카드 -->
    <div>
      <div v-if="profileInfo" class="card shadow-sm mb-4 text-center">
        <div class="card-body" width="300" height="500">
          <div class="profile-image-container">
            <img :src="profileInfo.imgUrl ? `${backendUrl}${profileInfo.imgUrl}` : defaultProfile" alt="Profile Image" class="profile-image-square">
          </div>
          <div>
            <h5 class="mt-2">{{ profileInfo.nickname }}님의 미니홈피</h5>             
            <p class="text-muted small">{{ miniHomeUrl }}</p>
            <button
              v-if="profileInfo.mid && profileInfo.mid !== store.state.mid"
              class="btn btn-sm btn-primary ms-2 mb-3"
              @click="addFriend(profileInfo.mid)"
            >
              친구 추가
            </button>
              <ul v-if="profileInfo && memberInfo" class="list-unstyled text-start small">

                <li>📧 이메일: {{ memberInfo.email }}</li>
                <li>🎂 생년월일: {{ profileInfo.birthdate }}</li>
                <li v-if="profileInfo.statusMessage" class="dunggeunmo-font" style="white-space: pre-wrap;">💬 상태메세지: {{ profileInfo.statusMessage }}</li>
                <li v-else class="dunggeunmo-font text-muted">💬 상태메세지가 없습니다.</li>
              </ul>
              <!-- <li v-if="profileInfo.address" class="dunggeunmo-font" style="white-space: pre-wrap;">{{ profileInfo.address }}</li>
              <li v-else class="dunggeunmo-font text-muted">주소가 없습니다.</li> -->
          </div>
        </div>
      </div>
    <div v-if="!profileInfo && !memberInfo">
      <p>로딩 중...</p>
    </div>
    </div>
    <div class="list-group shadow-sm">
      <RouterLink :to="`${miniHomeUrl}`" class="list-group-item list-group-item-action">홈</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/diary`" class="list-group-item list-group-item-action">일기장</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/guestboard`" class="list-group-item list-group-item-action">방명록</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/jukebox`" class="list-group-item list-group-item-action">주크박스</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/friend`" class="list-group-item list-group-item-action">친구</RouterLink>
      <RouterLink :to="`${miniHomeUrl}/profile`" class="list-group-item list-group-item-action">프로필</RouterLink>
    </div>
  </div>
  <!-- 메뉴 -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import defaultProfile from '@/assets/image/default-profile.png' // 기본 이미지
import profileApi from '@/apis/profileApi'; // API 모듈 import
import memberApi from '@/apis/memberApi'; // API 모듈 import
import store from '@/store'
import friendApi from '@/apis/friendApi';

// const backendUrl = 'http://192.168.4.42:8080';
// 1. 현재 URL 정보를 얻기 위해 useRoute() 사용
const route = useRoute();

// 2. URL 파라미터에서 'account'를 추출 (예: /myworld/userA -> 'userA')
const account = route.params.account;

// 3. 메뉴 링크를 만들기 위한 기본 URL
const miniHomeUrl = ref(`/myworld/${route.params.account}`);

// 4. 서버에서 받아온 프로필 정보를 저장할 반응형 변수. 초기값은 null.
const profileInfo = ref(null);
const memberInfo = ref(null);

// 5. 컴포넌트가 화면에 그려질 때(마운트될 때) API를 호출하는 함수
async function loadProfile(account) {
  if (account) { // account가 URL에 존재할 때만 API 호출
    try {
      // account를 인자로 넘겨 특정 사용자의 프로필 정보를 요청
      const response = await profileApi.getProfileInfo(account);
      // 성공적으로 데이터를 받아오면 profileInfo 변수에 저장
      profileInfo.value = response.data;
    } catch (error) {
      console.error("사이드바 프로필 정보를 불러오는 데 실패했습니다:", error);
      // 에러 발생 시 profileInfo는 계속 null 상태로 유지됨
    }
  }
}
// 5. 컴포넌트가 화면에 그려질 때(마운트될 때) API를 호출하는 함수
async function loadMember(account) {
  if (account) { // account가 URL에 존재할 때만 API 호출
    try {
      // account를 인자로 넘겨 특정 사용자의 프로필 정보를 요청
      const response = await memberApi.memberInfo(account);
      // 성공적으로 데이터를 받아오면 profileInfo 변수에 저장
      memberInfo.value = response.data;
    } catch (error) {
      console.error("사이드바 멤버 정보를 불러오는 데 실패했습니다:", error);
      // 에러 발생 시 profileInfo는 계속 null 상태로 유지됨
    }
  }
}

async function addFriend(mid) {
  if (!mid) return;
  if (!confirm("이 사용자에게 친구 요청을 보내시겠습니까?")) return;
  try {
    await friendApi.sendFriendRequest(mid);
    alert("친구 요청을 보냈습니다.");
  } catch (err) {
    console.error(err);
    alert("이미 친구 요청을 보냈습니다.");
  }
}

 onMounted(() => {
  loadProfile(account);
  loadMember(account);
});

watch(
  () => route.params.account,
  (newAccount) => {
    miniHomeUrl.value = `/myworld/${newAccount}`;
    loadProfile(newAccount);
    loadMember(newAccount);
  }
);
</script>

<style scoped>
.profile-image-container {
  /* flex 컨테이너의 자식 요소로서 공간을 차지하게 함 */
  display: flex;
  justify-content: center; /* 내부 아이템(이미지 또는 아이콘)을 가로 중앙 정렬 */
  align-items: center; /* 내부 아이템을 세로 중앙 정렬 */
  margin-bottom: 1rem; /* 이미지와 닉네임 사이의 간격 */
}

.profile-image-square {
  width: 120px;   /* 원하는 크기로 조절 */
  height: 120px;  /* 너비와 높이를 동일하게 설정 */
  object-fit: cover;
  border-radius: 15%; /* 둥근 모서리 */
  
  /* 아이콘 스타일 */
  font-size: 120px;
  line-height: 1; /* 아이콘이 컨테이너 밖으로 나가지 않도록 줄 높이 조절 */
}
</style>