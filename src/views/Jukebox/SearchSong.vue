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

<script>
import axios from "axios";

export default {
  name: "SearchSongs",
  data() {
    return {
      query: "",
      results: [],
      searched: false,
    };
  },
  methods: {
    async searchSongs() {
      if (!this.query.trim()) return;
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`/songs/search`, {
          params: { query: this.query },
          headers: { Authorization: `Bearer ${token}` },
        });
        this.results = res.data;
        this.searched = true;
      } catch (err) {
        console.error("검색 실패:", err);
      }
    },
    async addSong(videoId) {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.post(
          `/songs/create`,
          { videoId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        alert(`'${res.data.title}' 이(가) 나의 음악에 추가되었습니다!`);
      } catch (err) {
        console.error("추가 실패:", err);
        alert("추가 실패!");
      }
    },
  },
};
</script>
