<template>
  <div class="container my-4">
    <!-- 상단 -->
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>🎵 주크박스</h3>
      <div v-if="isMyPage">
        <router-link :to="`/myworld/${$route.params.account}/jukebox/mysongs`" class="btn btn-outline-primary me-2">
          나의 음악
        </router-link>
        <router-link :to="`/myworld/${$route.params.account}/jukebox/create`" class="btn btn-primary">
          + 새 주크박스
        </router-link>
      </div>
    </div>

    <!-- 목록 -->
    <div v-if="jukeboxes.length > 0" class="row">
      <div v-for="box in jukeboxes" :key="box.jid" class="col-md-4 mb-3">
        <div class="jukebox-card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-0 text-primary fw-bold" style="cursor: pointer;" @click="openDetail(box.jid)">
              {{ box.title }}
            </h5>
            <p class="text-muted small mb-3">{{ box.content }}</p>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <p class="small text-muted mb-0 ms-1">
              {{ box.updatedAt?.substring(0, 10) || box.createdAt?.substring(0, 10) }}
            </p>
            <button class="btn btn-sm" @click="likeJukebox(box)">
              <span v-if="box.liked">❤️</span>
              <span v-else>🤍</span>
              {{ box.likeCount || box.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비었을 때 -->
    <div v-else class="text-center text-muted py-5 border rounded bg-light">
      <div class="mb-2" style="font-size: 2.5rem;">🎶</div>
      <p class="mb-0">아직 등록된 주크박스가 없습니다.</p>
    </div>

    <!-- 상세 모달 -->
    <div class="modal fade show" tabindex="-1" style="display: block;" v-if="showModal" @click.self="closeModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- 헤더 -->
          <div class="modal-header d-flex align-items-center justify-content-between">
            <h5 class="modal-title mb-0">🎵 {{ detail.title }}</h5>
            <div class="d-flex align-items-center ms-auto gap-2">
              <button v-if="isMyPage" class="btn btn-outline-primary btn-sm" @click="updateJukebox(detail.jid)">✏ 수정</button>
              <button v-if="isMyPage" class="btn btn-outline-danger btn-sm" @click="deleteJukebox(detail.jid)">🗑 삭제</button>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
          </div>

          <!-- 본문 -->
          <div class="modal-body">
            <p class="text-muted">{{ detail.content }}</p>
            <p><strong>총 재생시간:</strong> {{ formatDuration(detail.totalDuration) }}</p>
            <p><strong>수록곡 수:</strong> {{ detail.trackCount }}</p>

            <!-- 🎵 전체 재생 -->
            <div class="d-flex gap-2 mb-3">
              <button v-if="!isPlaying" class="btn btn-primary btn-sm" @click="playAllSongs">
                ▶ 전체 재생
              </button>
              <button v-if="isPlaying" class="btn btn-outline-secondary btn-sm" @click="stopPlaying">
                ⏹ 정지
              </button>
            </div>

            <hr />
            <h6>🎶 수록곡</h6>
            <ul class="list-group">
              <li v-for="(song, idx) in detail.songs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center" :class="{ active: idx === currentIndex }">
                {{ song.title }} - {{ song.artist }}
                <span class="text-muted small">{{ song.duration }}초</span>
              </li>
            </ul>

            <!-- YouTube Player -->
            <div id="youtube-player" class="hidden-player"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global YT */
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import jukeboxApi from "@/apis/jukeboxApi";

const store = useStore();
const route = useRoute();
const router = useRouter();

const jukeboxes = ref([]);
const showModal = ref(false);
const detail = ref({});
// {
//   "jid": 3,
//   "title": "플레이리스트",
//   "content": "조용한 노래 모음",
//   "trackCount": 2,
//   "totalDuration": 380,
//   "songs": [
//     { "sid": 1, "title": "Love Dive", "artist": "IVE", "duration": 180, "videoId": "Y8JFxS1HlDo" },
//     { "sid": 2, "title": "Ditto", "artist": "NewJeans", "duration": 200, "videoId": "pSUydWEqKwE" }
//   ]
// }

const isPlaying = ref(false);
const currentIndex = ref(-1);

// 내부 상태
let player = null;
let playerReady = false;
let apiScriptLoaded = false;

const account = route.params.account;

// 내 홈 여부. 내 홈이 아니면 주크박스 리스트만 보임
const isMyPage = computed(() => route.params.account === store.state.account);

// 주크박스 목록 불러오기
async function loadJukeboxes() {
  try {
    const res = await jukeboxApi.getJukeboxList(account);
    jukeboxes.value = res.data || [];
  } catch (e) {
    console.error(e);
  }
}

// 상세 정보
async function openDetail(jid) {
  try {
    const res = await jukeboxApi.getJukeboxDetail(jid);
    detail.value = res.data;
    showModal.value = true;

    await nextTick(); // DOM이 업데이트된 다음에 코드를 실행. 모달이 화면에 나타난 뒤에
    await loadYouTubeAPI(); // 이 안에서
    createPlayer(); // youtube player 찾기
  } catch (e) {
    console.error(e);
  }
}

// YouTube API 로드 (Promise 기반)
// ********* 여기는 조금 더 알아봐야될것같아... 유튜브 api 괜히썻나...... ************
function loadYouTubeAPI() {
  return new Promise((resolve) => { // 유튜브 스크립트가 로드될 때까지 기다림
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    if (apiScriptLoaded) return; // script 여러번 추가하는걸 방지. default false
    apiScriptLoaded = true;

    const tag = document.createElement("script"); // html script 태그를 자바스크립트로 만들고
    tag.src = "https://www.youtube.com/iframe_api"; // 스크립트가 불러올 주소를 지정하고
    document.body.appendChild(tag); // body에 스크립트를 붙여서 실행되게

    window.onYouTubeIframeAPIReady = () => { // YouTube 스크립트가 로드되면 자동으로 호출
      resolve(window.YT); // 성공하면 반환
    };
  });
}

// Player 생성
// 가끔 플레이어 생성이 안돼서 재생이 안되는데 어디를 고쳐야하지
// 그냥 새로고침하면 되긴 하는데
function createPlayer() {
  if (player) return;
  player = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    playerVars: { autoplay: 0, controls: 0, rel: 0 },
    events: {
      onReady: () => (playerReady = true),
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.ENDED && isPlaying.value) nextSong();
      },
    },
  });
}

// 전체 재생
function playAllSongs() {
  if (!detail.value.songs?.length) return;
  if (!playerReady) {
    return;
  }
  isPlaying.value = true;
  currentIndex.value = 0;
  playCurrent();
}

// 현재 곡 재생
function playCurrent() {
  const song = detail.value.songs[currentIndex.value];
  if (!song?.videoId) return;
  console.log("재생 시도:", song.title);
  player.loadVideoById(song.videoId); // YouTube API: 지정한 영상 ID를 불러오기
}

// 다음 곡
function nextSong() {
  currentIndex.value++;
  if (currentIndex.value >= detail.value.songs.length) currentIndex.value = 0; // 처음으로 초기화
  playCurrent();
}

// 정지
function stopPlaying() {
  isPlaying.value = false;
  currentIndex.value = -1;
  if (player) player.stopVideo(); // YouTube API: 현재 영상 중지
}




// 닫기
function closeModal() {
  stopPlaying();
  showModal.value = false;
  detail.value = {};
}

// 주크박스 수정
function updateJukebox(jid) {
  showModal.value = false;
  router.push(`/myworld/${store.state.account}/jukebox/update/${jid}`);
}

// 주크박스 삭제
async function deleteJukebox(jid) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    await jukeboxApi.deleteJukebox(jid);
    alert("삭제되었습니다");
    showModal.value = false;
    loadJukeboxes();
  } catch (e) {
    console.error(e);
  }
}


// 좋아요 아직 미완성
// 여기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
async function likeJukebox(box) {
  try {
    await jukeboxApi.likeJukebox(box.jid);
    box.liked = !box.liked;
    box.likeCount += box.liked ? 1 : -1;
  } catch (e) {
    console.error(e);
  }
}

// 초 -> 분:초로 변환
function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

onMounted(() => {
  loadJukeboxes();
});

onBeforeUnmount(() => {
  if (player) {
    player.destroy();
    player = null;
  }
});
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.hidden-player {
  position: fixed;
  bottom: -9999px;
  left: -9999px;
  width: 300px;
  height: 150px;
  opacity: 0;
  pointer-events: none;
}

.active {
  background-color: #e9f5ff;
  font-weight: bold;
}

.jukebox-card {
  background: #fff;
  border-radius: 16px;
  transition: all 0.25s ease;
  cursor: pointer;
  border: 1px solid #f1f1f1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: scale(1); /* 기본 크기 */
}

/* 💫 hover 시 살짝 확대 & 그림자 강조 */
.jukebox-card:hover {
  transform: scale(1.03); /* 3% 커짐 */
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
}
</style>
