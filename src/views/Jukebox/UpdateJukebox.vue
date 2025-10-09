<template>
  <div class="container my-4">
    <h3>✏ 주크박스 수정</h3>

    <!-- 카드 형태 입력 폼 -->
    <div class="card shadow-sm mt-3">
      <div class="card-body">
        <!-- 제목 -->
        <div class="mb-3">
          <label class="form-label">제목</label>
          <input type="text" class="form-control" v-model="updatedJukebox.title" placeholder="주크박스 제목" />
        </div>

        <!-- 설명 -->
        <div class="mb-3">
          <label class="form-label">내용</label>
          <textarea class="form-control" rows="3" v-model="updatedJukebox.content" placeholder="주크박스 설명"></textarea>
        </div>

        <!-- 음악 선택 -->
        <div class="mb-3">
          <label class="form-label">수록곡</label>
          <div class="d-flex justify-content-end mb-2">
            <button class="btn btn-outline-primary btn-sm" @click="showModal = true">
              + 음악 추가
            </button>
          </div>

          <!-- 선택된 음악 목록 -->
          <ul v-if="selectedSongs.length > 0" class="list-group">
            <li v-for="song in selectedSongs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center">
              {{ song.title }} - {{ song.artist }}
              <button class="btn btn-sm btn-outline-danger" @click="removeSong(song.sid)">
                삭제
              </button>
            </li>
          </ul>

          <div v-else class="text-muted py-2 text-center">
            아직 수록곡이 없습니다.
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="card-footer d-flex justify-content-end gap-2">
        <button class="btn btn-primary btn-sm" @click="saveUpdate">수정 완료</button>
        <router-link :to="`/myworld/${$route.params.account}/jukebox`" class="btn btn-light btn-sm">
          취소
        </router-link>
      </div>
    </div>

    <!-- 음악 선택 모달 -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-window">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>🎵 내 음악에서 추가하기</h5>
          <button class="btn-close" @click="showModal = false"></button>
        </div>

        <ul v-if="mySongs.length > 0" class="list-group">
          <li v-for="song in mySongs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ song.title }}</strong> - {{ song.artist }}
            </div>
            <button class="btn btn-sm" :class="isSelected(song.sid) ? 'btn-success' : 'btn-outline-success'" @click="toggleSong(song)">
              {{ isSelected(song.sid) ? '✅ 추가됨' : '➕ 추가' }}
            </button>
          </li>
        </ul>

        <div v-else class="text-center text-muted py-4">
          저장된 음악이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import jukeboxApi from "@/apis/jukeboxApi";

const router = useRouter();
const route = useRoute();

const updatedJukebox = ref({ jid: null, title: "", content: "" });
const mySongs = ref([]); // 내 음악 목록
const selectedSongs = ref([]); // 선택된 음악 목록
const tracks = ref([]); // DB 기준 트랙 목록
const showModal = ref(false);

// 기존 주크박스 정보 불러오기
async function loadJukeboxDetail() {
  try {
    const jid = route.params.jid;
    const res = await jukeboxApi.getJukeboxDetail(jid);

    updatedJukebox.value = {
      jid: res.data.jid,
      title: res.data.title,
      content: res.data.content
    };

    // DB 기준으로 트랙 목록 세팅
    tracks.value = res.data.songs.map(s => ({
      trid: s.trid,
      sid: s.sid,
      title: s.title,
      artist: s.artist
    }));

    selectedSongs.value = [...tracks.value];
  } catch (e) {
    console.error(e);
  }
}

// 내 음악 목록 불러오기
async function loadMySongs() {
  try {
    const res = await jukeboxApi.getMySong();
    mySongs.value = res.data;
  } catch (e) {
    console.error(e);
  }
}

// 선택 여부 확인
function isSelected(sid) {
  return selectedSongs.value.some(s => s.sid === sid);
}

// 추가/제거 토글
function toggleSong(song) {
  const index = selectedSongs.value.findIndex(s => s.sid === song.sid);
  if (index !== -1) {
    selectedSongs.value.splice(index, 1);
  } else {
    selectedSongs.value.push(song);
  }
}

// 선택된 곡 삭제
function removeSong(sid) {
  selectedSongs.value = selectedSongs.value.filter(s => s.sid !== sid);
}

// 수정 저장
async function saveUpdate() {
  try {
    const jid = updatedJukebox.value.jid;

    // 삭제할 트랙 (DB에는 있는데 선택 목록에서 제거된 경우)
    const tracksToDelete = tracks.value.filter(
      t => !selectedSongs.value.some(s => s.sid === t.sid)
    );
    for (const t of tracksToDelete) {
      await jukeboxApi.deleteTrack(t.trid);
    }

    // 추가할 트랙 (선택 목록에는 있지만 DB에는 없는 경우)
    const tracksToAdd = selectedSongs.value.filter(
      s => !tracks.value.some(t => t.sid === s.sid)
    );
    for (const s of tracksToAdd) {
      await jukeboxApi.createTrack({ jid, sid: s.sid });
    }

    // 주크박스 제목/내용 업데이트
    await jukeboxApi.updateJukebox(updatedJukebox.value);

    // DB 기준으로 다시 상세정보 불러오기
    await loadJukeboxDetail();

    alert("수정 완료!");
    router.push(`/myworld/${route.params.account}/jukebox`);
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  loadJukeboxDetail();
  loadMySongs();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-window {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
}
</style>
