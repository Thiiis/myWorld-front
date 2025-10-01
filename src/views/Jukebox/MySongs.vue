<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>📀 나의 음악</h3>
      <router-link to="/jukebox" class="btn btn-secondary">← 뒤로</router-link>
    </div>

    <ul class="list-group shadow-sm">
      <li
        v-for="(song, idx) in mySongs"
        :key="idx"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ song.title }} - {{ song.artist }}
        <div>
          <button class="btn btn-sm btn-outline-secondary me-2">▶</button>
          <button class="btn btn-sm btn-danger" @click="deleteMySong(idx)">삭제</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MySongs",
  data() {
    return {
      mySongs: [
        { title: "봄날", artist: "BTS" },
        { title: "Celebrity", artist: "아이유" },
        { title: "WANNABE", artist: "ITZY" },
        { title: "Stay", artist: "Justin Bieber" },
      ],
    };
  },
  methods: {
    deleteMySong(idx) {
      this.mySongs.splice(idx, 1);
    },
  },
};
</script>
