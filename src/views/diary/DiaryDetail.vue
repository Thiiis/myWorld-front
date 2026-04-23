<template>
  <div class="container py-4 diary-detail-page">
    <!-- 🔹 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="fw-bold text-primary mb-0">
        {{ entry.title || "오늘의 하늘" }}
      </h4>
      <div class="d-flex gap-2">
        <template v-if="isMyDiary">
          <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" @click="goUpdate">
            <i class="bi bi-pencil-square"></i> 편집
          </button>
          <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" @click="deleteDiary">
            <i class="bi bi-trash"></i> 삭제
          </button>
        </template>
        <button class="btn btn-sm btn-outline-secondary" @click="goBack">
          ← 목록으로
        </button>
      </div>
    </div>

    <!-- 🔹 이미지 영역 -->
    <div v-if="images.length" id="imageCarousel" class="carousel slide mb-4">
      <div class="carousel-inner">
        <div
          v-for="(img, index) in images"
          :key="index"
          :class="['carousel-item', { active: index === currentImageIndex }]"
        >
          <img
            :src="img"
            class="d-block w-100"
            alt="이미지"
            style="object-fit:contain;height:400px;border-radius:12px;"
          />
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        @click="moveToPrevImage"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">이전</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        @click="moveToNextImage"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">다음</span>
      </button>
    </div>

    <!-- 이미지 없을 때 -->
    <div
      v-else
      class="d-flex flex-column align-items-center justify-content-center text-muted mb-4 py-4 bg-light rounded"
    >
      <i class="bi bi-image fs-1"></i>
      <small>등록된 사진이 없습니다</small>
    </div>

    <!-- 🔹 썸네일 -->
    <div
      v-if="images.length"
      class="d-flex justify-content-center flex-wrap gap-2 mb-4"
    >
      <div
        v-for="(img, index) in images"
        :key="index"
        class="thumbnail-item"
        :class="{ selected: index === currentImageIndex }"
        @click="setCurrentImage(index)"
      >
        <img :src="img" alt="썸네일" class="thumbnail-img" />
      </div>
    </div>

    <!-- 🔹 일기 본문 -->
    <div class="content-card p-4 mb-4 shadow-sm bg-white rounded">
      <div class="d-flex align-items-center gap-2 mb-2">
        <span v-if="entry.emo" class="fs-3">{{ emojiMap[entry.emo]?.emoji }}</span>
        <span v-if="entry.weather" class="fs-3">{{ emojiMap[entry.weather]?.emoji }}</span>
        <button
          class="btn btn-sm ms-auto"
          :class="entry.likedByMe ? 'btn-danger' : 'btn-outline-danger'"
          @click="toggleLike"
          :disabled="likeLoading || !entry.id"
        >
          <i :class="['bi', entry.likedByMe ? 'bi-heart-fill' : 'bi-heart']"></i>
          <span>{{ entry.likes ?? 0 }}</span>
        </button>
      </div>

      <div class="text-muted small mb-2">{{ entry.date || "날짜 없음" }}</div>

      <h6 class="fw-bold mb-2">일기 내용</h6>
      <p class="diary-content">{{ entry.content || "작성된 내용이 없습니다." }}</p>
    </div>

    <!-- 🔹 댓글 -->
    <div class="comment-section p-3 border rounded bg-white shadow-sm">
      <h6 class="fw-bold mb-3">💬 댓글</h6>
      <CommentList v-if="entry.did" :did="entry.did" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import CommentList from "@/views/diary/list_components/CommentList.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const entry = computed(() => store.getters["diary/getSelectedEntry"] || {});
const myMid = computed(() => store.state?.mid);
const isMyDiary = computed(() => entry.value && Number(entry.value.mid) === Number(myMid.value));

const images = computed(() => {
  const e = entry.value || {};
  const list = [];
  const added = new Set();

  if (e.thumbnail) {
    list.push(e.thumbnail.url);
    added.add(e.thumbnail.url);
  }
  if (e.attachments?.length) {
    e.attachments
      .filter((a) => a.atype?.startsWith("image"))
      .forEach((a) => {
        if (!added.has(a.url)) {
          list.push(a.url);
          added.add(a.url);
        }
      });
  }
  return list;
});

const currentImageIndex = ref(0);
const moveToPrevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length;
};
const moveToNextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % images.value.length;
};
const setCurrentImage = (index) => (currentImageIndex.value = index);

const emojiMap = {
  SUNNY: { emoji: "☀️" },
  CLOUDY: { emoji: "🌥️" },
  RAINY: { emoji: "☔" },
  SNOWY: { emoji: "❄️" },
  HAPPY: { emoji: "😊" },
  CALM: { emoji: "😌" },
  EXCITED: { emoji: "🤩" },
  SAD: { emoji: "😥" },
};

const likeLoading = ref(false);
const toggleLike = async () => {
  const did = entry.value?.did || entry.value?.id;
  if (!did) return;
  likeLoading.value = true;
  try {
    await store.dispatch("diary/toggleLike", did);
  } finally {
    likeLoading.value = false;
  }
};

const goUpdate = () => {
  router.push({ name: "DiaryUpdate", params: { id: entry.value.id } });
};

const deleteDiary = async () => {
  if (!confirm("정말 이 일기를 삭제하시겠습니까?")) return;
  try {
    await store.dispatch("diary/deleteDiary", {
      did: entry.value.id,
      hostAccount: route.params.account,
    });
    alert("삭제되었습니다.");
    router.push({ name: "DiaryList" });
  } catch (e) {
    console.error("삭제 실패:", e);
  }
};

const goBack = () => router.push({ name: "DiaryList" });

// ✅ 진입 시 선택된 일기 로드
onMounted(async () => {
  const id = route.params.id;
  await store.dispatch("diary/fetchDiary", id);
});
</script>

<style scoped>
.diary-detail-page {
  max-width: 900px;
  margin: 0 auto;
}

.thumbnail-item {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.2s;
}
.thumbnail-item.selected {
  border-color: #5a6bff;
  box-shadow: 0 4px 12px rgba(33, 70, 255, 0.25);
}
.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-card {
  border: 1px solid #e7edff;
  border-radius: 16px;
  background: #fff;
}

.diary-content {
  white-space: pre-line;
  line-height: 1.8;
  border: 1px dashed #e4eaff;
  border-radius: 12px;
  padding: 16px;
  background: #fdfdff;
}

.comment-section {
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .thumbnail-item {
    width: 80px;
    height: 80px;
  }
}

</style>
