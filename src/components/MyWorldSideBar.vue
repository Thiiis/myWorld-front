<template>
  <div class="custom-sidebar">
    <!-- 프로필 카드 -->
    <div class="profile-section">
      <!-- 1. 로딩 컨테이너: isLoading이 true일 때만 표시 -->
      <div v-if="isLoading" class="loading-container text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">프로필을 불러오는 중...</p>
      </div>

      <!-- 2. 프로필 카드: 로딩이 끝났고(false), profileInfo 데이터가 있을 때만 표시 -->
      <div v-if="profileInfo" class="card shadow-sm mb-4 text-center">
        <div class="card-body p-4 text-center" width="300" height="500">
          <div class="profile-image-container">
            <img :src="profileInfo.imgUrl ? `${backendUrl}${profileInfo.imgUrl}` : defaultProfile" alt="Profile Image"
              class="profile-image-square">
          </div>
          <div>
            <h5 class="mt-2">{{ profileInfo.nickname }}님의 미니홈피</h5>
            <p class="text-muted small">{{ miniHomeUrl }}
              <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard(miniHomeUrl)">
                <i class="bi bi-clipboard"></i>
              </button>
            </p>
            <button v-if="profileInfo.mid && profileInfo.mid !== store.state.mid && !profileInfo.isFriend"
              class="btn btn-sm btn-primary ms-2 mb-3" @click="addFriend(profileInfo.mid)">
              <i class="bi bi-person-plus"></i> 친구 신청
            </button>
            <button v-else-if="profileInfo.isFriend" class="btn btn-sm btn-secondary ms-2 mb-3" disabled>
              <i class="bi bi-person-check"></i> 친구 신청
            </button>
            <ul v-if="profileInfo && memberInfo" class="list-unstyled text-start small">
              <li>
                <span class="info-label">📧 이메일: </span>
                <span class="info-data">{{ memberInfo.email }}</span>
              </li>
              <li>
                <span class="info-label">🎂 생년월일: </span>
                <span class="info-data">{{ profileInfo.birthdate }}</span>
              </li>
              <li v-if="profileInfo.statusMessage" class="dunggeunmo-font" style="white-space: pre-wrap;">
                <span class="info-label">💬 상태메세지: </span>
                <span class="info-data">{{ profileInfo.statusMessage }}</span>
              </li>
              <li v-else class="dunggeunmo-font text-muted">💬 상태메세지가 없습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 메뉴 항목 -->
    <div class="sidebar-nav">
      <ul class="nav flex-column">
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}`" :class="['nav-link', 'nav-profile', { 'active': route.path === miniHomeUrl }]">
            <i class="bi bi-house-door-fill"></i>
            <span>홈</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}/diary`" :class="['nav-link', 'nav-diary', { 'active': isLinkActive(`${miniHomeUrl}/diary`) }]">
            <i class="bi bi-journal-richtext"></i>
            <span>일기장</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}/guestboard`" :class="['nav-link', 'nav-guestboard', { 'active': isLinkActive(`${miniHomeUrl}/guestboard`) }]">
            <i class="bi bi-chat-left-text-fill"></i>
            <span>방명록</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}/jukebox`" :class="['nav-link', 'nav-jukebox', { 'active': isLinkActive(`${miniHomeUrl}/jukebox`) }]">
            <i class="bi bi-music-note-beamed"></i>
            <span>주크박스</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}/friend`" :class="['nav-link', 'nav-friend', { 'active': isLinkActive(`${miniHomeUrl}/friend`) }]">
            <i class="bi bi-people-fill"></i>
            <span>친구</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink :to="`${miniHomeUrl}/profile`" :class="['nav-link', 'nav-profile', { 'active': isLinkActive(`${miniHomeUrl}/profile`) }]">
            <i class="bi bi-person-fill"></i>
            <span>프로필</span>
          </RouterLink>
        </li>
      </ul>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import defaultProfile from '@/assets/image/default-profile.png' // 기본 이미지
import profileApi from '@/apis/profileApi'; // API 모듈 import
import memberApi from '@/apis/memberApi'; // API 모듈 import
import store from '@/store'
import friendApi from '@/apis/friendApi';
const backendUrl = 'http://192.164.4.42:8080';
// 1. 현재 URL 정보를 얻기 위해 useRoute() 사용
const route = useRoute();

// 2. URL 파라미터에서 'account'를 추출 (예: /myworld/userA -> 'userA')
const account = route.params.account;

// 3. 메뉴 링크를 만들기 위한 기본 URL
const miniHomeUrl = ref(`/myworld/${route.params.account}`);

// 클립보드에 URL을 복사하는 메소드
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('링크가 클립보드에 복사되었습니다!');
  }).catch((error) => {
    console.error('복사 실패:', error);
  });
};

// ✅ 수정된 코드: 현재 경로가 특정 URL로 시작하는지 확인하는 함수
const isLinkActive = (basePath) => {
  return route.path.startsWith(basePath);
};
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
     
      if (profileInfo.value && profileInfo.value.mid !== store.state.mid) {
      const myFriendsRes = await friendApi.getFriendList(store.state.mid);
      const myFriendMids = myFriendsRes.data.map(f => f.friendInfo.mid);
      profileInfo.value.isFriend = myFriendMids.includes(profileInfo.value.mid);
    } else {
      profileInfo.value.isFriend = false;
    }
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

/* 전체 사이드바 컨테이너 스타일 */
.custom-sidebar {
  background-color: #f8f9fa;
  /* 연한 회색 배경 */
  padding: 1rem;
  border-radius: 15px;
  /* 컨테이너 모서리 둥글게 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* 은은한 그림자 효과 */
  width: 100%;
  /* 부모 요소 너비의 100%를 차지하도록 설정 */
  max-width: 400px;
  /* 너비가 400px를 초과하지 않도록 제한 */
  /* min-width: 280px;   */
  /* 너무 얇아지지 않도록 최소 너비 설정 (선택 사항) */
}

.profile-image-container {
  /* flex 컨테이너의 자식 요소로서 공간을 차지하게 함 */
  display: flex;
  justify-content: center;
  /* 내부 아이템(이미지 또는 아이콘)을 가로 중앙 정렬 */
  align-items: center;
  /* 내부 아이템을 세로 중앙 정렬 */
  margin-bottom: 1rem;
  /* 이미지와 닉네임 사이의 간격 */
}

.profile-image-square {
  width: 120px;
  /* 원하는 크기로 조절 */
  height: 120px;
  /* 너비와 높이를 동일하게 설정 */
  object-fit: cover;
  border-radius: 15%;
  /* 둥근 모서리 */

  /* 아이콘 스타일 */
  font-size: 120px;
  line-height: 1;
  /* 아이콘이 컨테이너 밖으로 나가지 않도록 줄 높이 조절 */
}


/* --- 내비게이션 링크(a 태그) 공통 기본 스타일 --- */
.nav-link {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  /* 기본 텍스트 색상을 여기서 지정하지 않고, 개별 클래스에서 지정합니다. */
}

/* 1. 각 메뉴별 기본 텍스트/아이콘 색상 (새로운 블루 팔레트) */
.nav-link.nav-home {
  color: #0052C6;
}

/* 홈 (진한 파랑) */
.nav-link.nav-diary {
  color: #007ABF;
}

/* 일기장 (중간 파랑) */
.nav-link.nav-guestboard {
  color: #00A2CC;
}

/* 방명록 (진한 시안) */
.nav-link.nav-jukebox {
  color: #00BAAC;
}

/* 주크박스 (진한 청록) */
.nav-link.nav-friend {
  color: #00CCB1;
}

/* 친구 (진한 민트) */
.nav-link.nav-profile {
  color: #3600CC;
}

/* 프로필 (진한 청보라) */


/* 2. 활성화된 링크의 공통 스타일 (글자색 흰색으로) */
.nav-link.active {
  color: #ffffff !important;
  /* 활성화 시 모든 텍스트/아이콘은 흰색 고정 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 3. 각 메뉴별 활성화(active) 상태 배경색 (새로운 블루 팔레트) */
.nav-link.nav-home.active {
  background-color: #0065F8;
  border-color: #0065F8;
}

/* 홈 (선명한 파랑) */
.nav-link.nav-diary.active {
  background-color: #009AEF;
  border-color: #009AEF;
}

/* 일기장 (밝은 파랑) */
.nav-link.nav-guestboard.active {
  background-color: #00CAFF;
  border-color: #00CAFF;
}

/* 주크박스 (청록) */
.nav-link.nav-jukebox.active {
  background-color: #00EAD9;
  border-color: #00EAD9;
}

/* 친구 (민트) */
.nav-link.nav-friend.active {
  background-color: #00FFDE;
  border-color: #00FFDE;
}

/* 프로필 (선명한 청보라) */
.nav-link.nav-profile.active {
  background-color: #4300FF;
  border-color: #4300FF;
}



/* 4. 마우스 호버(hover) 효과 통일 */
.nav-link:hover:not(.active) {
  transform: translateY(-2px);
  background-color: #f8f9fa;
  /* 마우스를 올렸을 때 연한 회색 배경으로 통일 */
}

/* --- 아이콘 공통 스타일 --- */
.nav-link i {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  transition: color 0.2s ease-in-out;
  /* 아이콘 색상 변경도 부드럽게 */
}

/* 네비게이션 아이템(li) 간격 조절 */
.nav-item {
  margin-bottom: 1rem;
  /* 이 값을 늘려서 간격을 넓힙니다. 1.2rem 등으로 더 늘려도 좋습니다. */
}

/* 마지막 아이템에는 여백이 필요 없으므로 그대로 둡니다. */
.nav-item:last-child {
  margin-bottom: 0;
}
</style>