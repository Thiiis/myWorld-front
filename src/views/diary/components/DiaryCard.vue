<template>
  <div class="card diary-card p-3">
    <div class="img-box">
      <img
        v-if="entry?.images && entry.images.length"
        :src="entry.images[0]"
        alt="일기 대표 이미지"
        class="img-fluid rounded"
      />
      <div v-else class="placeholder bg-light d-flex align-items-center justify-content-center">
        <i class="bi bi-image text-muted fs-3"></i>
      </div>
      <div class="like-badge">
        <i class="bi bi-heart-fill text-danger"></i>
        <span>{{ entry?.likes || 0 }}</span>
      </div>
    </div>

    <div class="card-content p-1 mt-2">
      <h6 class="fw-bold text-primary text-truncate">{{ entry?.title || '제목 없음' }}</h6>
      
      <p class="small text-muted mb-1">{{ entry?.date || '날짜 미정' }}</p>
      
      <p class="small text-dark entry-content">{{ entry?.content || '내용이 없습니다.' }}</p>

      <div class="d-flex flex-wrap gap-1 mt-2">
        <span v-for="tag in entry?.tags" :key="tag" class="badge bg-light text-primary">
          #{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ entry: Object });
</script>

<style scoped>
.diary-card {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  height: 100%; /* 카드 높이 균일화에 도움 */
}
.diary-card:hover {
  transform: translateY(-5px); /* 더 드라마틱한 호버 효과 */
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}
.img-box {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 10px; /* 이미지 자체에 둥근 모서리 적용 */
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
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 4px;
}
.entry-content {
    /* 2줄까지만 표시하고 생략 처리 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; 
    -webkit-box-orient: vertical;
    min-height: 2.4em; /* 2줄 높이 확보 */
}
</style>