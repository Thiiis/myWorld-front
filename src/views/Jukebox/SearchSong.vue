<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>🔍 음악 검색</h3>
      <router-link :to="`/myworld/${$route.params.account}/jukebox/mysongs`" class="btn btn-secondary">
        ← 나의 음악
      </router-link>
    </div>

    <!-- 검색창 -->
    <div class="input-group mb-3">
      <input
        v-model="query"
        type="text"
        class="form-control"
        placeholder="노래 제목이나 가수를 입력하세요"
        @keyup.enter="searchSongs"
      />
      <button class="btn btn-primary" @click="searchSongs">검색</button>
    </div>

    <!-- 검색 결과 -->
    <ul v-if="results.length > 0" class="list-group shadow-sm">
      <li
        v-for="(song, idx) in results"
        :key="idx"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ song.title }} - {{ song.artist }}
        <button class="btn btn-sm btn-outline-success" @click="addSong(song.videoId)">
          ➕ 추가
        </button>
      </li>
    </ul>

    <div v-else-if="searched" class="text-muted text-center mt-4">
      검색 결과가 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import jukeboxApi from "@/apis/jukeboxApi";

const query = ref("");
const results = ref([]);
const searched = ref(false);
const loading = ref(false);

async function searchSongs() {
  if (!query.value.trim()) return;

  try {
    loading.value = true;
    const res = await jukeboxApi.searchSong(query.value);
    results.value = res.data;
    searched.value = true;
  } catch (err) {
    console.error("검색 실패:", err);
    searched.value = true;
    results.value = [];
  } finally {
    loading.value = false;
  }
}

async function addSong(videoId) {
  try {
    const res = await jukeboxApi.createSong({ videoId });
    alert(`'${res.data.title}' 이(가) 나의 음악에 추가되었습니다!`);
  } catch (err) {
    console.error("추가 실패:", err);
    alert("추가 실패!");
  }
}
</script>

