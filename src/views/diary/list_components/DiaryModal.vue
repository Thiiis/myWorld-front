<template>
  <div class="modal fade" id="diaryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 shadow border-0">

        <!-- 헤더: 제목 + 편집/삭제 버튼 -->
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 class="fw-bold m-0 text-primary">
            {{ selectedEntry.title || "오늘의 하늘" }}
          </h6>
          <div class="d-flex gap-2">
            <template v-if="isMyDiary">
            <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" title="편집" @click="onEditDiary">
              <i class="bi bi-pencil-square"></i> 편집
            </button>
            <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" title="삭제" @click="onDeleteDiary">
              <i class="bi bi-trash"></i> 삭제
            </button>
            </template>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
        </div>

        <!-- 이미지 슬라이드 -->
        <div v-if="images.length" id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div v-for="(img, index) in images" :key="index" :class="{'carousel-item': true, 'active': index === currentImageIndex}">
              <img :src="img" alt="이미지" class="d-block w-100" style="object-fit: contain; height: 250px; border-radius: 10px;">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" @click="moveToPrevImage">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" @click="moveToNextImage">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <!-- 이미지 없을 경우 -->
        <div v-else class="d-flex flex-column align-items-center justify-content-center text-muted">
          <i class="bi bi-image fs-1"></i>
          <small>등록된 사진이 없습니다</small>
        </div>

        <!-- 썸네일 -->
        <div v-if="images.length" class="image-thumbnails mt-3 d-flex justify-content-center">
          <div v-for="(img, index) in images" :key="index" class="thumbnail-item"
               @click="setCurrentImage(index)" :class="{'selected-thumbnail': index === currentImageIndex}">
            <img :src="img" alt="이미지 미리보기" class="thumbnail-img" />
          </div>
        </div>

        <!-- 일기 본문 -->
        <div class="modal-body">
          <!-- 교체: 좋아요 토글 + 개수 + 비활성화 표시 -->
          <div class="d-flex align-items-center gap-2 mb-2">
            <button
              class="btn btn-sm d-inline-flex align-items-center gap-1"
              :class="selectedEntry.likedByMe ? 'btn-danger' : 'btn-outline-danger'"
              @click="onToggleLike"
              :disabled="likeLoading || !(selectedEntry?.did ?? selectedEntry?.id)"
            >
              <i :class="['bi', selectedEntry.likedByMe ? 'bi-heart-fill' : 'bi-heart']"></i>
              <span>{{ selectedEntry.likes ?? 0 }}</span>
            </button>

          </div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex gap-2 flex-wrap">
              <span v-if="selectedEntry.emo" class="badge rounded-pill bg-light text-secondary">
                {{ emojiMap[selectedEntry.emo]?.emoji || "" }}
                {{ emojiMap[selectedEntry.emo]?.label || selectedEntry.emo }}
              </span>
              <span v-if="selectedEntry.weather" class="badge rounded-pill bg-light text-secondary">
                {{ emojiMap[selectedEntry.weather]?.emoji || "" }}
                {{ emojiMap[selectedEntry.weather]?.label || selectedEntry.weather }}
              </span>
              <span v-for="tag in selectedEntry.tags || []" :key="tag" class="badge rounded-pill bg-light text-secondary">
                #{{ tag }}
              </span>
            </div>
          </div>
          <div class="mb-2 text-muted small">
            {{ selectedEntry.date || "날짜 없음" }}
          </div>
          <div class="mb-4">
            <h6 class="fw-bold mb-2">일기 내용</h6>
            <p class="text-dark diary-content">
              {{ selectedEntry.content || "작성된 내용이 없습니다." }}
            </p>
          </div>
          <div class="border-top pt-3">
             <CommentList :did="selectedEntry.did" /> <!-- CommentList에 현재 일기 ID 전달 -->
          </div>
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
const moveToPrevImage = () => currentImageIndex.value = (currentImageIndex.value -1 + images.value.length) % images.value.length;
const moveToNextImage = () => currentImageIndex.value = (currentImageIndex.value +1) % images.value.length;
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
  await store.dispatch("diary/fetchDiaries", {  pageNo: 1, hostAccount: route.params.account ?? null  });
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
const emojiMap = { SUNNY: { emoji: "☀️", label: "맑음" }, CLOUDY: { emoji: "🌥️", label: "흐림" }, RAINY: { emoji: "☔", label: "비" }, SNOWY: { emoji: "❄️", label: "눈" }, HAPPY: { emoji: "😊", label: "기쁨" }, CALM: { emoji: "😌", label: "평온" }, EXCITED: { emoji: "🤩", label: "신남" }, SAD: { emoji: "😥", label: "슬픔" }, };

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
.carousel-inner .carousel-item img { height:auto; object-fit:contain; max-height:300px; border-radius:10px; }
.carousel-control-prev-icon, .carousel-control-next-icon { background-color:#000; }
.carousel-control-prev, .carousel-control-next { top:50%; transform:translateY(-50%); }
.modal-dialog { max-width:800px; width:90%; height:80vh; overflow-y:auto; }
.image-thumbnails { display:flex; justify-content:center; gap:10px; margin-top:20px; }
.thumbnail-item { width:60px; height:60px; border-radius:5px; overflow:hidden; cursor:pointer; border:2px solid transparent; }
.thumbnail-item.selected-thumbnail { border-color:#0d6efd; }
.thumbnail-img { width:100%; height:100%; object-fit:cover; }
.diary-content { white-space:pre-line; }
</style>
