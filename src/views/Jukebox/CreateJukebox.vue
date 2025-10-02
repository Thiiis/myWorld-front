<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>➕ 새 주크박스 만들기</h3>
      <router-link :to="`/myworld/${$route.params.account}/jukebox`" class="btn btn-secondary me-2">
        뒤로
      </router-link>
    </div>

    <div class="card shadow-sm p-3">
      <input
        type="text"
        class="form-control mb-2"
        placeholder="주크박스 제목"
        v-model="newJukebox.title"
      />
      <textarea
        class="form-control mb-2"
        placeholder="설명"
        v-model="newJukebox.description"
      ></textarea>

      <!-- 음악 검색 -->
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="곡명이나 가수명을 검색하세요"
          v-model="searchQuery"
          @keyup.enter="searchSongs"
        />
        <button class="btn btn-primary" @click="searchSongs">검색</button>
      </div>

      <ul class="list-group mb-3">
        <li
          v-for="song in searchResults"
          :key="song.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ song.title }} - {{ song.artist }}
          <button class="btn btn-sm btn-outline-primary" @click="addSong(song)">추가</button>
        </li>
      </ul>

      <!-- 선택된 곡 -->
      <h6>추가된 곡</h6>
      <ul class="list-group mb-3">
        <li
          v-for="(song, idx) in newJukebox.songs"
          :key="idx"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ song.title }} - {{ song.artist }}
          <button class="btn btn-sm btn-danger" @click="removeSong(idx)">삭제</button>
        </li>
      </ul>

      <button class="btn btn-success w-100" @click="createJukebox">✅ 주크박스 생성</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateJukebox",
  data() {
    return {
      newJukebox: { title: "", description: "", songs: [] },
      searchQuery: "",
      searchResults: [],
    };
  },
  methods: {
    searchSongs() {
      const dummy = [
        { id: 1, title: "봄날", artist: "BTS" },
        { id: 2, title: "Celebrity", artist: "아이유" },
        { id: 3, title: "WANNABE", artist: "ITZY" },
        { id: 4, title: "Stay", artist: "Justin Bieber" },
        { id: 5, title: "Levitating", artist: "Dua Lipa" },
      ];
      this.searchResults = dummy.filter(
        (s) =>
          s.title.includes(this.searchQuery) ||
          s.artist.includes(this.searchQuery)
      );
    },
    addSong(song) {
      this.newJukebox.songs.push(song);
    },
    removeSong(idx) {
      this.newJukebox.songs.splice(idx, 1);
    },
    createJukebox() {
      if (!this.newJukebox.title) return alert("제목을 입력하세요!");
      console.log("새 주크박스 생성:", this.newJukebox);
      alert("주크박스가 생성되었습니다!");
      this.$router.push("/jukebox");
    },
  },
};
</script>
