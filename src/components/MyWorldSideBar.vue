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

      <!-- 2. 에러 메시지: 로딩이 끝났고 에러가 있을 때 표시 -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- 3. 프로필 카드: 로딩이 끝났고(false), profileInfo 데이터가 있을 때만 표시 -->
      <div v-else-if="profileInfo" class="card shadow-sm mb-4 text-center">
        <div class="card-body p-4 text-center" width="300" height="500">
          <div class="profile-image-container">
            <img :src="profileInfo.imgUrl ? `${backendUrl}${profileInfo.imgUrl}` : defaultProfile" alt="Profile Image" class="profile-image-square">
          </div>
          <div>
            <h5 class="mt-2">{{ profileInfo.nickname }}님의 미니홈피</h5>
            <p class="text-muted small">{{ miniHomeUrl }}
              <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard(miniHomeUrl)">
                <i class="bi bi-clipboard"></i>
              </button>
            </p>
            <!-- '내 프로필'이 아닐 때만 친구 신청 버튼을 보여줌 -->
            <button v-if="!isMyProfile && !profileInfo.isFriend" class="btn btn-sm btn-primary ms-2 mb-3" @click="addFriend(profileInfo.mid)">
              <i class="bi bi-person-plus"></i> 친구 신청
            </button>
            <button v-else-if="!isMyProfile && profileInfo.isFriend" class="btn btn-sm btn-secondary ms-2 mb-3" disabled>
              <i class="bi bi-person-check"></i> 친구
            </button>

            <ul v-if="memberInfo" class="list-unstyled text-start small">
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
          <RouterLink :to="`${miniHomeUrl}`" :class="['nav-link', 'nav-home', { 'active': route.path === miniHomeUrl }]">
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

    <!-- 🎵 주크박스 -->
    <div class="jukebox-section mt-4 p-3 text-center">
      <h6 class="text-primary fw-bold">
        <i class="bi bi-music-note-beamed"></i> 주크박스
      </h6>

      <div v-if="jukebox" class="jukebox-box p-3 mt-2">
        <p class="fw-bold mb-1 text-dark">{{ jukebox.title }}</p>
        <p class="small text-muted mb-2">
          🎶 {{ currentSong ? `${currentSong.artist} - ${currentSong.title}` : '재생할 곡이 없습니다.' }}
        </p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-primary btn-sm rounded-circle" @click="playAllSongs" v-if="!isPlaying">
            <i class="bi bi-play-fill"></i>
          </button>
          <button class="btn btn-secondary btn-sm rounded-circle" @click="stopPlaying" v-if="isPlaying">
            <i class="bi bi-pause-fill"></i>
          </button>
        </div>
        <div id="sidebar-youtube-player" class="hidden-player"></div>
      </div>

      <div v-else class="jukebox-box p-3 mt-2 text-muted">
        <p class="mb-0">선택된 주크박스가 없습니다.</p>
      </div>
    </div>


  </div>
</template>

<script setup>
/* global YT */
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import defaultProfile from '@/assets/image/default-profile.png';
import profileApi from '@/apis/profileApi';
import memberApi from '@/apis/memberApi';
import store from '@/store';
import friendApi from '@/apis/friendApi';
import jukeboxApi from '@/apis/jukeboxApi';

const backendUrl = 'http://192.168.4.42:8080';
const route = useRoute();
const account = ref(route.params.account);
const miniHomeUrl = ref(`/myworld/${route.params.account}`);

// State variables
const profileInfo = ref(null);
const memberInfo = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isMyProfile = ref(false);

// 주크박스 관련 변수
const jukebox = ref(null);
const currentSong = ref(null);
const isPlaying = ref(false);

let player = null;
let playerReady = false;
let apiLoaded = false;

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('링크가 클립보드에 복사되었습니다!');
  }).catch((err) => {
    console.error('복사 실패:', err);
  });
};

const isLinkActive = (basePath) => {
  return route.path.startsWith(basePath);
};

async function loadProfile(targetAccount) {
  if (!targetAccount) return;
  try {
    const response = await profileApi.getProfileInfo(targetAccount);
    profileInfo.value = response.data;

    // isMyProfile 상태를 여기서 명확하게 설정
    if (profileInfo.value && profileInfo.value.mid === store.state.mid) {
      isMyProfile.value = true;
      profileInfo.value.isFriend = false; // 내 프로필은 친구가 아님
    } else {
      isMyProfile.value = false;
      // 다른 사람 프로필일 때만 친구 상태 확인
      const myFriendsRes = await friendApi.getFriendList(store.state.mid);
      const myFriendMids = myFriendsRes.data.map(f => f.friendInfo.mid);
      profileInfo.value.isFriend = myFriendMids.includes(profileInfo.value.mid);
    }
  } catch (err) {
    console.error("사이드바 프로필 정보를 불러오는 데 실패했습니다:", err);
    error.value = "프로필 정보를 가져올 수 없습니다.";
  }
}

async function loadMember(targetAccount) {
  if (!targetAccount) return;
  try {
    const response = await memberApi.memberInfo(targetAccount);
    memberInfo.value = response.data;
  } catch (err) {
    console.error("사이드바 멤버 정보를 불러오는 데 실패했습니다:", err);
    // 멤버 정보는 부가 정보이므로, 실패해도 전체 에러로 처리하지 않음
  }
}

async function addFriend(friendMid) {
  if (!friendMid) return;
  if (!confirm("이 사용자에게 친구 요청을 보내시겠습니까?")) return;
  try {
    await friendApi.sendFriendRequest(friendMid);
    alert("친구 요청을 보냈습니다.");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "이미 친구 요청을 보냈거나 처리 중입니다.");
  }
}

// 주크박스 불러오기
async function loadJukebox() {
  try {
    // 프로필에서 선택된 주크박스 정보 가져오기
    const res = await profileApi.getSelectedJukebox(account.value);
    if (!res.data || !res.data.jid) {
      console.log("선택된 주크박스 없음");
      jukebox.value = null;
      return;
    }

    // 주크박스 상세 정보 가져오기 (곡 리스트 포함)
    const detailRes = await jukeboxApi.getJukeboxDetail(res.data.jid);
    jukebox.value = detailRes.data;
    currentSong.value = jukebox.value?.songs?.[0] || null;

    console.log("선택된 주크박스 로드 완료:", jukebox.value);

    await nextTick();
    await loadYouTubeAPI();
    createPlayer();


    if (jukebox.value?.songs?.length > 0) {
      setTimeout(() => {
        playAllSongs();
      }, 500);
    }
  } catch (err) {
    console.error("주크박스 정보를 불러오지 못했습니다:", err);
  }
}

// YouTube API 로드
function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    if (apiLoaded) return;
    apiLoaded = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
}

// Player 생성
function createPlayer() {
  if (player) return;
  player = new YT.Player("sidebar-youtube-player", {
    height: "0",
    width: "0",
    playerVars: { autoplay: 0, controls: 0, rel: 0 },
    events: {
      onReady: () => (playerReady = true),
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED) nextSong();
      },
    },
  });
}

// 전체 재생
function playAllSongs() {
  if (!jukebox.value?.songs?.length || !playerReady) return;
  isPlaying.value = true;
  currentSong.value = jukebox.value.songs[0];
  player.loadVideoById(currentSong.value.videoId);
}

// 다음 곡
function nextSong() {
  const songs = jukebox.value.songs;
  const currentIndex = songs.findIndex(s => s.sid === currentSong.value.sid);
  const nextIndex = (currentIndex + 1) % songs.length;
  currentSong.value = songs[nextIndex];
  player.loadVideoById(currentSong.value.videoId);
}

// 정지
function stopPlaying() {
  isPlaying.value = false;
  player.stopVideo();
}




onMounted(async () => {
  isLoading.value = true;
  try {
    await loadProfile(account.value);
    await loadMember(account.value);
    await loadJukebox();

    if (jukebox.value && jukebox.value.songs?.length > 0) {
      setTimeout(() => {
        playAllSongs();
        console.log("미니홈 입장 시 자동 재생");
      }, 1000);
    }
  } catch (err) {
    console.error("사이드바 데이터 로딩 중 에러 발생:", err);
    error.value = "데이터를 불러오는 중 문제가 발생했습니다.";
  } finally {
    isLoading.value = false; // 모든 작업이 끝나면 로딩 상태 해제
  }
});

// 다른 사람의 미니홈으로 갔을 때
watch(
  () => route.params.account,
  async (newAccount) => {
    miniHomeUrl.value = `/myworld/${newAccount}`;
    account.value = newAccount;

    // 플레이어 리셋
    if (player) {
      player.stopVideo();
      player.destroy();
      player = null;
      playerReady = false;
    }

    isPlaying.value = false;
    jukebox.value = null;

    await loadProfile(newAccount);
    await loadMember(newAccount);
    await loadJukebox();

    // 주크박스가 있고, 곡이 있을 때 자동재생 시도
    if (jukebox.value && jukebox.value.songs?.length > 0) {
      const waitUntilReady = setInterval(() => {
        if (playerReady) {
          clearInterval(waitUntilReady);
          playAllSongs();
          console.log("친구 홈 입장 시 자동 재생");
        }
      }, 300);
    }
  }
);

// 주크박스를 변경했을 때
watch(
  () => store.state.jukebox.selectedJukebox,
  async (newVal, oldVal) => {
    if (!isMyProfile.value) return;

    // 🔹 로그로 확인
    console.log("👀 Sidebar 감지됨:", oldVal, "→", newVal);

    // 🔹 새로운 주크박스가 선택된 경우
    if (newVal && newVal.jid) {
      console.log("🎵 주크박스 변경 → 사이드바 갱신 시작");

      // 🔹 store값 바로 반영 (DB 다시 안 불러와도 됨)
      const detailRes = await jukeboxApi.getJukeboxDetail(newVal.jid);
      jukebox.value = { ...detailRes.data }; // ✅ 새 객체로 반응성 트리거
      currentSong.value = jukebox.value.songs?.[0] || null;

      // 🔹 Vue DOM 업데이트 강제 반영
      await nextTick();
      console.log("✅ 사이드바 갱신 완료:", jukebox.value.title);
    } 
    else {
      // 🔹 선택 해제 시 초기화
      console.log("🧹 주크박스 해제됨");
      jukebox.value = null;
      currentSong.value = null;
    }
  },
  { deep: true }
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
  min-height: 250px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* 전체 사이드바 컨테이너 스타일 */
.custom-sidebar {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-image-square {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 15%;
  font-size: 120px;
  line-height: 1;
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
}

/* 1. 각 메뉴별 기본 텍스트/아이콘 색상 (새로운 블루 팔레트) */
.nav-link.nav-home {
  color: #0052C6;
}

.nav-link.nav-diary {
  color: #007ABF;
}

.nav-link.nav-guestboard {
  color: #00A2CC;
}

.nav-link.nav-jukebox {
  color: #00BAAC;
}

.nav-link.nav-friend {
  color: #00CCB1;
}

.nav-link.nav-profile {
  color: #3600CC;
}


/* 2. 활성화된 링크의 공통 스타일 (글자색 흰색으로) */
.nav-link.active {
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 3. 각 메뉴별 활성화(active) 상태 배경색 (새로운 블루 팔레트) */
.nav-link.nav-home.active {
  background-color: #0065F8;
  border-color: #0065F8;
}

.nav-link.nav-diary.active {
  background-color: #009AEF;
  border-color: #009AEF;
}

.nav-link.nav-guestboard.active {
  background-color: #00CAFF;
  border-color: #00CAFF;
}

.nav-link.nav-jukebox.active {
  background-color: #00EAD9;
  border-color: #00EAD9;
}

.nav-link.nav-friend.active {
  background-color: #00FFDE;
  border-color: #00FFDE;
}

.nav-link.nav-profile.active {
  background-color: #4300FF;
  border-color: #4300FF;
}


/* 4. 마우스 호버(hover) 효과 통일 */
.nav-link:hover:not(.active) {
  transform: translateY(-2px);
  background-color: #f8f9fa;
}

/* --- 아이콘 공통 스타일 --- */
.nav-link i {
  margin-right: 0.75rem;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  transition: color 0.2s ease-in-out;
}

.nav-item {
  margin-bottom: 1rem;
}

.nav-item:last-child {
  margin-bottom: 0;
}

.jukebox-section {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.jukebox-box {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background-color: #fdfdfd;
}

.hidden-player {
  display: none;
}
</style>