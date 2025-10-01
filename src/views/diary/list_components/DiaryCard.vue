<template>
  <div class="card diary-card p-3">
    <div class="img-box">
      <!-- ✅ thumbnail 우선 -->
      <img
        v-if="entry?.thumbnail"
        :src="entry.thumbnail"
        alt="일기 대표 이미지"
        class="img-fluid rounded"
      />

      <!-- ✅ thumbnail 없으면 images[0] -->
      <img
        v-else-if="entry?.images && entry.images.length"
        :src="entry.images[0]"
        alt="일기 첨부 이미지"
        class="img-fluid rounded"
      />

      <!-- ✅ 둘 다 없으면 placeholder -->
      <div v-else class="placeholder bg-light d-flex align-items-center justify-content-center">
        <i class="bi bi-image text-muted fs-3"></i>
      </div>

      <!-- 좋아요 뱃지 -->
      <div class="like-badge">
        <i class="bi bi-heart-fill text-danger"></i>
        <span>{{ entry?.likes || 0 }}</span>
      </div>
    </div>

    <div class="card-content p-1 mt-2">
      <!-- 제목 -->
      <h6 class="fw-bold text-primary text-truncate">
        {{ entry?.title || "제목 없음" }}
      </h6>

      <!-- 날짜 / 날씨 / 감정 -->
      <p class="small text-muted mb-1">
        {{ entry?.date || "날짜 미정" }}
        <span v-if="entry?.weather"> · {{ entry.weather }}</span>
        <span v-if="entry?.emo"> · {{ entry.emo }}</span>
      </p>

      <!-- 내용 -->
      <p class="small text-dark entry-content">
        {{ entry?.content || "내용이 없습니다." }}
      </p>

      <!-- 태그 -->
      <div class="d-flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in entry?.tags"
          :key="tag"
          class="badge bg-light text-primary"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  entry: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style scoped>
.diary-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  height: 100%; /* 카드 높이 균일화 */
}
.diary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}
.img-box {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 10px;
}
.placeholder {
  height: 100%;
}
.like-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.8rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 4px;
}
.entry-content {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  min-height: 2.4em;
}
</style>