<template>
  <div class="container my-4">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>➕ 새 주크박스 만들기</h3>
      <router-link :to="`/myworld/${$route.params.account}/jukebox`" class="btn btn-outline-secondary">
        뒤로
      </router-link>
    </div>

    <!-- 카드 형태 입력 폼 -->
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- 제목 -->
        <div class="mb-3">
          <label class="form-label">제목</label>
          <input type="text" class="form-control" placeholder="주크박스 제목을 입력하세요" v-model="newJukebox.title" />
        </div>

        <!-- 설명 -->
        <div class="mb-3">
          <label class="form-label">설명</label>
          <textarea class="form-control" rows="3" placeholder="주크박스에 대한 설명을 입력하세요" v-model="newJukebox.content"></textarea>
        </div>

        <!-- 음악 선택 -->
        <div class="mb-3">
          <label class="form-label">음악 선택</label>
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary btn-sm" @click="openSongModal">
              + 음악 추가
            </button>
          </div>

          <!-- 선택된 음악 목록 -->
          <ul v-if="selectedSongs.length > 0" class="list-group mt-2">
            <li v-for="song in selectedSongs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center">
              {{ song.title }} - {{ song.artist }}
              <button class="btn btn-sm btn-outline-danger" @click="removeSong(song.sid)">삭제</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="card-footer d-flex justify-content-end gap-2">
        <button class="btn btn-primary btn-sm" @click="createJukebox">
          만들기
        </button>
        <router-link :to="`/myworld/${$route.params.account}/jukebox`" class="btn btn-light btn-sm">
          취소
        </router-link>
      </div>
    </div>

    <!-- 음악 선택 모달 -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.4);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🎵 나의 음악 선택</h5>
            <button type="button" class="btn-close" @click="closeSongModal"></button>
          </div>
          <div class="modal-body">
            <ul v-if="mySongs.length > 0" class="list-group">
              <li v-for="song in mySongs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {{ song.title }} - {{ song.artist }}
                </div>

                <!-- ✅ 상태에 따라 버튼 스타일 변경 -->
                <button class="btn btn-sm" :class="isSelected(song.sid) ? 'btn-success' : 'btn-outline-success'" @click="toggleSong(song)">
                  {{ isSelected(song.sid) ? '✅ 추가됨' : '➕ 추가' }}
                </button>
              </li>
            </ul>

            <p v-else class="text-muted text-center">나의 음악이 없습니다.</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import jukeboxApi from "@/apis/jukeboxApi";

const router = useRouter();
const route = useRoute();
const store = useStore();

const newJukebox = ref({
  title: "",
  content: "",
});

const mySongs = ref([]); // 내 음악 목록
const selectedSongs = ref([]); // 선택된 음악들
const showModal = ref(false);

// ✅ 모달 열기/닫기
function openSongModal() {
  showModal.value = true;
}
function closeSongModal() {
  showModal.value = false;
}

// ✅ 내 음악 불러오기
async function loadMySongs() {
  try {
    const res = await jukeboxApi.getMySong();
    mySongs.value = res.data;
  } catch (err) {
    console.error("❌ 음악 불러오기 실패:", err);
  }
}

// ✅ 음악 추가
function addSong(song) {
  if (!selectedSongs.value.find((s) => s.sid === song.sid)) {
    selectedSongs.value.push(song);
  }
}

// ✅ 선택 취소
function removeSong(sid) {
  selectedSongs.value = selectedSongs.value.filter((s) => s.sid !== sid);
}

// ✅ 주크박스 생성 + 트랙 생성
async function createJukebox() {
  try {
    const res = await jukeboxApi.createJukebox(newJukebox.value);
    const jid = res.data.jid;

    // 음악 추가
    for (const song of selectedSongs.value) {
      await jukeboxApi.createTrack({
        jid: jid,
        sid: song.sid
      });
    }

    alert("주크박스가 생성되었습니다!");
    router.push(`/myworld/${route.params.account}/jukebox`);
  } catch (err) {
    console.error("❌ 생성 실패:", err.response?.data || err);
    alert("생성 중 오류가 발생했습니다.");
  }
}

// ✅ 선택 여부 확인
function isSelected(sid) {
  return selectedSongs.value.some((s) => s.sid === sid);
}

// ✅ 추가/제거 토글 기능
function toggleSong(song) {
  const index = selectedSongs.value.findIndex((s) => s.sid === song.sid);
  if (index !== -1) {
    // 이미 추가된 경우 → 제거
    selectedSongs.value.splice(index, 1);
  } else {
    // 아직 안 추가된 경우 → 추가
    selectedSongs.value.push(song);
  }
}


onMounted(() => {
  loadMySongs();
});
</script>
