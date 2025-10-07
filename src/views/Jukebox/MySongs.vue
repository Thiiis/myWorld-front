<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>📀 나의 음악</h3>
      <div>
        <router-link
          :to="`/myworld/${$route.params.account}/jukebox`"
          class="btn btn-secondary me-2"
        >
          뒤로
        </router-link>
        <router-link
          :to="`/myworld/${$route.params.account}/jukebox/search`"
          class="btn btn-primary"
        >
          🔍 검색하기
        </router-link>
      </div>
    </div>

    <!-- 내 음악 목록 -->
    <ul class="list-group shadow-sm" v-if="mySongs.length > 0">
      <li
        v-for="song in mySongs"
        :key="song.sid"
        class="list-group-item"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ song.title }}</strong> - {{ song.artist }}
          </div>
          <div>
            <button
              class="btn btn-sm"
              :class="isPlaying(song) ? 'btn-outline-danger' : 'btn-outline-secondary'"
              @click="togglePlay(song)"
            >
              {{ isPlaying(song) ? '⏸ 정지' : '▶ 재생' }}
            </button>
            <button class="btn btn-sm btn-danger ms-2" @click="deleteSong(song.sid)">
              삭제
            </button>
          </div>
        </div>

        <!-- 🎵 재생 중일 때 iframe (소리만 나옴, 화면에는 안보임) -->
        <div v-if="isPlaying(song)" class="hidden-player">
          <iframe
            :src="`https://www.youtube.com/embed/${song.videoId}?autoplay=1&mute=0`"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
      </li>
    </ul>

    <!-- 비었을 때 -->
    <div v-else class="text-center text-muted py-5 border rounded bg-light">
      <div class="mb-2" style="font-size: 2.5rem;">🎶</div>
      <p class="mb-0">
        아직 저장된 음악이 없습니다.<br />
        검색하기 버튼을 눌러 노래를 추가하세요!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import jukeboxApi from "@/apis/jukeboxApi";

const mySongs = ref([]);
const currentPlaying = ref(null); // 현재 재생 중인 곡 sid

async function loadMySongs() {
  try {
    const res = await jukeboxApi.getMySong();
    mySongs.value = res.data;
  } catch (e) {
    console.error("❌ 음악 목록 로드 실패:", e);
  }
}

// 🎵 재생 토글
function togglePlay(song) {
  if (currentPlaying.value === song.sid) {
    // 같은 곡 다시 누르면 정지
    currentPlaying.value = null;
  } else {
    // 다른 곡 클릭하면 교체 재생
    currentPlaying.value = song.sid;
  }
}

// 현재 재생 중인지 확인
function isPlaying(song) {
  return currentPlaying.value === song.sid;
}

// 🗑 삭제 기능
async function deleteSong(sid) {
  if (!confirm("이 노래를 삭제하시겠습니까?")) return;
  try {
    await jukeboxApi.deleteSong(sid);
    await loadMySongs();
  } catch (e) {
    console.error("❌ 삭제 실패:", e);
  }
}

onMounted(() => {
  loadMySongs();
});
</script>

<style scoped>
.hidden-player {
  width: 1px;
  height: 1px;
  overflow: hidden;
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
