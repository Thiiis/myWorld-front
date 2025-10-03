<template>
  <div class="container my-4">
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <h3>🎵 주크박스</h3>
      <div>
        <router-link :to="`/myworld/${$route.params.account}/jukebox/mysongs`" class="btn btn-outline-primary me-2">
          나의 음악
        </router-link>
        <router-link :to="`/myworld/${$route.params.account}/jukebox/create`" class="btn btn-primary">
          + 새 주크박스
        </router-link>
      </div>
    </div>

    <!-- 주크박스 목록 -->
    <div v-if="jukeboxes.length > 0" class="row">
      <div
        v-for="box in jukeboxes"
        :key="box.id"
        class="col-md-4 mb-3"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ box.title }}</h5>
            <p class="text-muted small">{{ box.description }}</p>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center">
            <small>{{ box.date }}</small>
            <button class="btn btn-sm" @click="toggleLike(box)">
              <span v-if="box.liked">❤️</span>
              <span v-else>🤍</span>
              {{ box.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비었을 때 (아이콘 포함) -->
    <div v-else class="text-center text-muted py-5 border rounded bg-light">
      <div class="mb-2" style="font-size: 2.5rem;">🎶</div>
      <p class="mb-0">아직 등록된 주크박스가 없습니다.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Jukebox",
  data() {
    return {
      jukeboxes: [] // 처음엔 비어 있음
    };
  }
};
</script>
