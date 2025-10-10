<template>
  <div class="modal fade" id="diaryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 shadow border-0">

        <!-- 고정영역: 헤더 + 이미지 + 썸네일 + 일기 본문 -->
        <div class="fixed-pane">
          <!-- 헤더 -->
          <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 class="fw-bold m-0 text-primary">{{ selectedEntry.title || "오늘의 하늘" }}</h6>
            <div class="d-flex gap-2">
              <template v-if="isMyDiary">
                <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" title="편집" @click="onEditDiary"><i class="bi bi-pencil-square"></i> 편집</button>
                <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" title="삭제" @click="onDeleteDiary"><i class="bi bi-trash"></i> 삭제</button>
              </template>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
          </div>

          <!-- 이미지 슬라이드 -->
          <div v-if="images.length" id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(img, index) in images" :key="index" :class="{ 'carousel-item': true, 'active': index === currentImageIndex }">
                <img :src="img" alt="이미지" class="d-block w-100" style="object-fit:contain;height:250px;border-radius:10px;">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" @click="moveToPrevImage"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span
                class="visually-hidden">Previous</span></button>
            <button class="carousel-control-next" type="button" @click="moveToNextImage"><span class="carousel-control-next-icon" aria-hidden="true"></span><span
                class="visually-hidden">Next</span></button>
          </div>

          <!-- 이미지 없을 경우 -->
          <div v-else class="d-flex flex-column align-items-center justify-content-center text-muted">
            <i class="bi bi-image fs-1"></i>
            <small>등록된 사진이 없습니다</small>
          </div>

          <!-- 썸네일 -->
          <div v-if="images.length" class="image-thumbnails mt-3 d-flex justify-content-center">
            <div v-for="(img, index) in images" :key="index" class="thumbnail-item" @click="setCurrentImage(index)" :class="{ 'selected-thumbnail': index === currentImageIndex }">
              <img :src="img" alt="이미지 미리보기" class="thumbnail-img">
            </div>
          </div>

          <!-- 일기 본문 -->
          <div class="content-card mb-4">
            <span v-if="selectedEntry.emo" class="fs-2 p-0 m-0">{{ emojiMap[selectedEntry.emo]?.emoji }}</span>
            <span v-if="selectedEntry.weather" class="fs-2 p-0 m-0">{{ emojiMap[selectedEntry.weather]?.emoji }}</span>
            <button class="btn btn-sm d-inline-flex align-items-center gap-1" :class="selectedEntry.likedByMe ? 'btn-danger' : 'btn-outline-danger'" @click="onToggleLike"
              :disabled="likeLoading || !(selectedEntry?.did ?? selectedEntry?.id)">
              <i :class="['bi', selectedEntry.likedByMe ? 'bi-heart-fill' : 'bi-heart']"></i><span>{{ selectedEntry.likes ?? 0 }}</span>
            </button>
            <div class="mb-2 text-muted small">{{ selectedEntry.date || "날짜 없음" }}</div>
            <h6 class="fw-bold mb-2">일기 내용</h6>
            <p class="text-dark diary-content">{{ selectedEntry.content || "작성된 내용이 없습니다." }}</p>
          </div>
        </div>

        <!-- 스크롤 영역: 댓글 -->
        <div class="scroll-pane border-top pt-3">
          <CommentList v-if="selectedDiary?.did" :did="selectedDiary.did" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";
import CommentList from "@/views/Diary/list_components/CommentList.vue";
import router from "@/router";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

defineProps({
  selectedDiary: {
    type: Object,
    default: null,
  },
});

// 로그인한 사용자 mid
const myMid = computed(() => store.state?.mid);
// 선택된 일기
const selectedEntry = computed(() => store.getters["diary/getSelectedEntry"] || {});
// 버튼 표시 여부
const isMyDiary = computed(() => {
  const entry = selectedEntry.value;
  return entry && Number(entry.mid) === Number(myMid.value);
});

// 이미지 슬라이드
const images = computed(() => {
  const entry = selectedEntry.value || {};
  const list = [];
  const addedUrls = new Set();

  if (entry.thumbnail) { list.push(entry.thumbnail.url); addedUrls.add(entry.thumbnail.url); }
  if (entry.attachments?.length) {
    entry.attachments.filter(a => a.atype?.startsWith("image")).map(a => a.url)
      .forEach(url => { if (!addedUrls.has(url)) { list.push(url); addedUrls.add(url); } });
  }
  return list;
});

const currentImageIndex = ref(0);
const moveToPrevImage = () => currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length;
const moveToNextImage = () => currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
const setCurrentImage = (index) => currentImageIndex.value = index;

// 삭제
const onDeleteDiary = async () => {
  const entryId = selectedEntry.value?.id || selectedEntry.value?.did;
  if (!entryId) return;
  if (!confirm("정말 이 일기를 삭제하시겠습니까?")) return;

  try {
    await store.dispatch("diary/deleteDiary", { did: entryId, hostAccount: route.params.account ?? null });
  } catch (e) {
    console.error("일기 삭제 실패:", e);
    return;
  }

  const modalEl = document.getElementById("diaryModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
  await store.dispatch("diary/fetchDiaries", { pageNo: 1, hostAccount: route.params.account ?? null });
};

// 편집
const onEditDiary = () => {
  const entryId = selectedEntry.value?.id || selectedEntry.value?.did;
  if (!entryId) return;

  store.commit("diary/setSelectedEntry", selectedEntry.value);

  const modalEl = document.getElementById("diaryModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();

  router.push({ name: "DiaryUpdate", params: { id: entryId } });
};

// 이모지 매핑
const emojiMap = { SUNNY: { emoji: "☀️" }, CLOUDY: { emoji: "🌥️" }, RAINY: { emoji: "☔" }, SNOWY: { emoji: "❄️" }, HAPPY: { emoji: "😊" }, CALM: { emoji: "😌" }, EXCITED: { emoji: "🤩" }, SAD: { emoji: "😥" }, };

// 좋아요 가능 여부 (예: 로그인 필요만 체크)
const canLike = computed(() => {
  const did = selectedEntry.value?.did || selectedEntry.value?.id;
  return !!myMid.value && !!did; // 로그인했고 did가 있으면 가능
});

// 좋아요 토글
const likeLoading = ref(false);
const onToggleLike = async () => {
  const did = selectedEntry.value?.did || selectedEntry.value?.id;
  if (!did || !canLike.value) return;
  likeLoading.value = true;
  try {
    await store.dispatch("diary/toggleLike", did);
  } finally {
    likeLoading.value = false;
  }
  await nextTick();
};


</script>

<style scoped>
/* ========= Modal 기본 레이아웃 ========= */
.modal-dialog {
  max-width: 900px;
  width: 82%;
  height: auto;
  max-height: 100vh;
}

.modal-content {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  border: 1px solid #e7edff;
  background: #fff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, .25);
  max-height: none;
  overflow: visible;
}

.modal-header,
.modal-content .border-bottom {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 2;
  background: linear-gradient(180deg, #f9fbff 0%, #fff 100%);
  border-color: #eef3ff !important;
}

.modal-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  background: #f9fbff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 12px;
}

.modal-content h6 {
  color: #4c63ff;
  letter-spacing: .2px;
}

/* ===== 고정 영역(헤더~본문) ===== */
.fixed-pane {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f9fbff;
  border-bottom: 1px solid #e7edff;
  padding-bottom: 12px;
  max-height: min(65vh, 640px);
  overflow: auto;
  border-radius: 12px;
}

/* ===== 타이포/버튼 ===== */
.modal-content h6 {
  color: #4c63ff;
  letter-spacing: .2px;
}

.btn.btn-outline-primary.btn-sm,
.btn.btn-outline-danger.btn-sm {
  border-radius: 10px;
  padding: 6px 10px;
}

.btn-close {
  filter: grayscale(1);
  opacity: .7;
}

/* ========= Carousel (정사각) ========= */
#imageCarousel {
  padding: 10px 0 0 !important;
  flex: 0 0 auto;
}

#imageCarousel .carousel-inner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #f6f9ff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, .10);
}

#imageCarousel .carousel-item,
#imageCarousel .carousel-item img {
  width: 100%;
  height: 100%;
}

#imageCarousel .carousel-item img {
  object-fit: cover;
  border-radius: 12px;
}

.carousel-control-prev,
.carousel-control-next {
  width: 36px;
  height: 36px;
  top: calc(50% - 18px);
  opacity: .85;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #4c63ff;
  border-radius: 999px;
  padding: 8px;
  background-size: 60% 60%;
}

/* ========= Thumbnails ========= */
.image-thumbnails {
  display: flex;
  justify-content: center;
  gap: var(--gap-s);
  margin: 10px auto 4px;
  padding: 0 14px;
}

.thumbnail-item {
  width: 100px;
  height: 100px;
}

.thumbnail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, .12);
}

.thumbnail-item.selected-thumbnail {
  border-color: #5a6bff;
  box-shadow: 0 8px 22px rgba(33, 70, 255, .18);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f9fbff;
  border-radius: 10px;
}

/* ===== 본문 카드 ===== */
.content-card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px 14px;
  background: #fff;
  border: 1px solid #e7edff;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, .08);
  padding: var(--card-pad);
}

.content-card>.btn {
  margin-left: auto;
  border: 1.6px solid #c8d2ff !important;
  background: transparent !important;
  border-radius: 12px;
  padding: 6px 12px;
  font-weight: 700;
  color: #6a6fd0 !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform .22s, border-color .22s, background .22s, color .22s;
  font-size: var(--fs-small);
}

.content-card>.btn:hover {
  transform: translateY(-1px) scale(1.05);
  background: #f5f7ff !important;
  border-color: #94a3ff !important;
  color: #5863ff !important;
}

.content-card>.btn.btn-danger {
  background: #fff0f3 !important;
  border-color: #f2a4b5 !important;
  color: #d6336c !important;
}

.content-card>.small {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  color: #6c7ae0 !important;
  font-weight: 600;
  font-size: var(--fs-small);
  margin-left: 10px;
}

.content-card>h6 {
  flex-basis: 100%;
  margin-top: 12px;
}

.diary-content {
  flex-basis: 100% !important;
  width: 100% !important;
  box-sizing: border-box;
  white-space: pre-line;
  line-height: 1.75;
  color: #1f2a44;
  background: #fff;
  border: 1px dashed #e4eaff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .7);
}

/* 댓글 스크롤 컨테이너 */
.scroll-pane {
  flex: 1;
  background: #fff;
  border: 1px solid #e7edff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, .06);
  overflow: auto;
  max-height: 35vh;
  display: flex;
  flex-direction: column;
}

/* ===== 반응형 ===== */
@media (max-width:992px) {
  .modal-dialog {
    width: 95%;
  }
}

@media (max-width:576px) {
  .modal-dialog {
    width: 98%;
    max-height: 94vh;
  }

  .fixed-pane {
    position: static;
    max-height: none;
    overflow: visible;
  }

  .scroll-pane {
    max-height: none;
  }
}

/* ========= 다크 모드 ========= */
@media (prefers-color-scheme:dark) {
  .modal-content {
    background: #0b1220;
    border-color: rgba(100, 120, 255, .22);
  }

  .modal-content .border-bottom {
    background: linear-gradient(180deg, #0d152a 0%, #0b1220 100%);
    border-color: rgba(100, 120, 255, .22) !important;
  }

  #imageCarousel .carousel-inner {
    background: #0f1730;
    box-shadow: 0 10px 22px rgba(0, 0, 0, .45);
  }

  .thumbnail-item {
    background: #0f1730;
    border-color: rgba(100, 120, 255, .16);
    box-shadow: 0 3px 8px rgba(0, 0, 0, .35);
  }

  .thumbnail-item.selected-thumbnail {
    border-color: #5868ff;
    box-shadow: 0 8px 22px rgba(50, 70, 255, .25);
  }

  .modal-body {
    background: #0a1020;
  }

  .content-card {
    background: #0f1730;
    border-color: rgba(100, 120, 255, .20);
    box-shadow: 0 10px 28px rgba(0, 0, 0, .45);
  }

  .diary-content {
    background: #0f1730;
    border-color: rgba(100, 120, 255, .20);
    color: #dbe4ff;
  }

  .modal-body .border-top {
    background: #0f1730;
    border-color: rgba(100, 120, 255, .20);
    box-shadow: 0 6px 20px rgba(0, 0, 0, .4);
  }

  .modal-body .border-top::before {
    background: linear-gradient(#0f1730, rgba(15, 23, 48, 0));
  }

  .modal-body .border-top::after {
    background: linear-gradient(rgba(15, 23, 48, 0), #0f1730);
  }

  .modal-body .border-top::-webkit-scrollbar-thumb {
    background: #3a477a;
  }
}
</style>
