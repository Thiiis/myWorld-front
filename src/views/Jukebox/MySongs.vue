<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>📀 나의 음악</h3>
      <div>
        <router-link :to="`/myworld/${$route.params.account}/jukebox`" class="btn btn-secondary me-2">
          뒤로
        </router-link>
        <router-link :to="`/myworld/${$route.params.account}/jukebox/search`" class="btn btn-primary">
          🔍 검색하기
        </router-link>
      </div>
    </div>

    <!-- 내 음악 목록 -->
    <ul class="list-group shadow-sm" v-if="mySongs.length > 0">
      <li v-for="song in mySongs" :key="song.sid" class="list-group-item d-flex justify-content-between align-items-center">
        {{ song.title }} - {{ song.artist }}
        <div>
          <button class="btn btn-sm btn-outline-secondary me-2">▶</button>
          <button class="btn btn-sm btn-danger" @click="deleteSong(song.sid)">삭제</button>
        </div>
      </li>
    </ul>

    <!-- 비었을 때 -->
    <div v-else class="text-center text-muted py-5 border rounded bg-light">
      <div class="mb-2" style="font-size: 2.5rem;">🎶</div>
      <p class="mb-0">아직 저장된 음악이 없습니다.<br>검색하기 버튼을 눌러 노래를 추가하세요!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import jukeboxApi from "@/apis/jukeboxApi";

const mySongs = ref([]);
const loading = ref(false);

async function loadMySongs() {
  try {
    loading.value = true;
    const res = await jukeboxApi.getMySong();
    mySongs.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function deleteSong(sid) {
  try {
    await jukeboxApi.deleteSong(sid);
    await loadMySongs();
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  loadMySongs();
});
</script>
