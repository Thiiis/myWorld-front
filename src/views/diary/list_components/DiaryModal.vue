<template>
  <div class="modal fade" id="diaryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 shadow border-0">

        <!-- 헤더 영역: 일기 제목, 편집, 삭제 버튼 -->
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 class="fw-bold m-0 text-primary"> {{ selectedEntry.title || "오늘의 하늘" }} </h6>
          <div class="d-flex gap-2">
            <!-- 편집 버튼 클릭 시 편집 페이지로 이동 -->
            <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" title="편집" @click="onEditDiary">
              <i class="bi bi-pencil-square"></i> 편집
            </button>
            <!-- 삭제 버튼 클릭 시 일기 삭제 -->
            <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" title="삭제" @click="onDeleteDiary">
              <i class="bi bi-trash"></i> 삭제
            </button>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
        </div>

        <!-- 이미지 슬라이드 영역 -->
        <div v-if="images.length" id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <!-- 슬라이드 이미지 -->
            <div v-for="(img, index) in images" :key="index"  :class="{'carousel-item': true, 'active': index === currentImageIndex}">
              <img :src="img" alt="이미지" class="d-block w-100" style="object-fit: contain; height: 250px; border-radius: 10px;">
            </div>
          </div>
          <!-- 이전 버튼 -->
          <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev" @click="moveToPrevImage">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <!-- 다음 버튼 -->
          <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next" @click="moveToNextImage">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <!-- 이미지가 없을 경우 대체 메시지 -->
        <div v-else class="d-flex flex-column align-items-center justify-content-center text-muted"> <i class="bi bi-image fs-1"></i> <small>등록된 사진이 없습니다</small> </div>
        <!-- 이미지 미리보기 섹션 -->
        <div v-if="images.length" class="image-thumbnails mt-3 d-flex justify-content-center">
          <div v-for="(img, index) in images" :key="index" class="thumbnail-item" @click="setCurrentImage(index)" :class="{'selected-thumbnail': index === currentImageIndex}">
            <img :src="img" alt="이미지 미리보기" class="thumbnail-img" />
          </div>
        </div>
        <!-- 일기 본문 내용 -->
        <div class="modal-body">
          <div> <i class="bi bi-heart-fill text-danger"></i> {{ selectedEntry.likes || 0 }} </div>
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
              <span v-for="tag in selectedEntry.tags" :key="tag" class="badge rounded-pill bg-light text-secondary">
                #{{ tag }}
              </span>
            </div>
          </div>
          <div class="mb-2 text-muted small"> {{ selectedEntry.date || "날짜 없음" }} </div>
          <div class="mb-4">
            <h6 class="fw-bold mb-2">일기 내용</h6>
            <p class="text-dark diary-content">
              {{ selectedEntry.content || "작성된 내용이 없습니다." }}
            </p>
          </div>

          <div class="border-top pt-3"> <CommentList :comments="selectedEntry.comments || []" /> </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";
import CommentList from "@/views/Diary/list_components/CommentList.vue";
import router from "@/router";

const store = useStore();
// 이모지 매핑
const emojiMap = { SUNNY: { emoji: "☀️", label: "맑음" }, CLOUDY: { emoji: "🌥️", label: "흐림" }, RAINY: { emoji: "☔", label: "비" }, SNOWY: { emoji: "❄️", label: "눈" }, HAPPY: { emoji: "😊", label: "기쁨" }, CALM: { emoji: "😌", label: "평온" }, EXCITED: { emoji: "🤩", label: "신남" }, SAD: { emoji: "😥", label: "슬픔" }, };
// Vuex에서 선택된 일기 가져오기
const selectedEntry = computed(() => store.getters["diary/getSelectedEntry"] || {});
// 이미지 리스트: 썸네일(0번)과 나머지 첨부파일을 중복 없이 모두 가져옵니다.
const images = computed(() => {
  const entry = store.state.diary.selectedEntry || {};
  const list = [];
  const addedUrls = new Set(); // 중복 URL을 체크하기 위한 Set
  // 1. 썸네일이 있다면 첫 번째 이미지로 추가
  if (entry.thumbnail) { list.push(entry.thumbnail.url); addedUrls.add(entry.thumbnail.url); }
  // 2. attachments에서 이미지 URL 추가 (썸네일 URL과 중복되지 않는 것만)
  if (entry.attachments && entry.attachments.length > 0) {
    entry.attachments
      .filter(a => a.atype && a.atype.startsWith("image"))
      .map(a => a.url)
      .forEach(url => {
        if (!addedUrls.has(url)) {
          list.push(url);
          addedUrls.add(url);
        }
      });
  }
  return list;
});
// 현재 슬라이드 이미지 인덱스
const currentImageIndex = ref(0);
// 이미지 슬라이드 이동 함수
const moveToPrevImage = () => { currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length; };
const moveToNextImage = () => {   currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length; };
// 미리보기 이미지 클릭 시 해당 이미지로 이동
const setCurrentImage = (index) => { currentImageIndex.value = index; };
// 삭제 핸들러
const onDeleteDiary = async () => {
 const entryId = selectedEntry.value?.id || selectedEntry.value?.did; 
 if (!entryId) return; // ID가 없으면 함수 종료
 if (!confirm("정말 이 일기를 삭제하시겠습니까?")) return;
 try {
  await store.dispatch("diary/deleteDiary", entryId); 
 } catch (e) {
  console.error("일기 삭제 실패:", e);
  return; // 실패 시 모달 닫기 방지
 }
 // 모달 닫기
 const modalEl = document.getElementById("diaryModal");
 const modalInstance = bootstrap.Modal.getInstance(modalEl);
 if (modalInstance) modalInstance.hide();
 // 모달이 닫히면서 목록을 다시 불러옵니다.
 await store.dispatch("diary/fetchDiaries");
};

// 편집 핸들러
const onEditDiary = () => {
 const entryId = selectedEntry.value?.id || selectedEntry.value?.did;
 if (!entryId) return; // ID가 없으면 함수 종료
 store.commit("diary/setSelectedEntry", selectedEntry.value); 
 const modalEl = document.getElementById("diaryModal");
 const modalInstance = bootstrap.Modal.getInstance(modalEl);
 if (modalInstance) modalInstance.hide();
 router.push({  name: "DiaryUpdate",  params: { id: entryId }  });
};
</script>

<style scoped>
.carousel-inner .carousel-item img { height: auto; object-fit: contain; max-height: 300px; border-radius: 10px; }
.carousel-control-prev-icon, .carousel-control-next-icon { background-color: #000;  }
.carousel-control-prev, .carousel-control-next { top: 50%; transform: translateY(-50%); }
.modal-dialog { max-width: 800px; width: 90%; height: 80vh; overflow-y: auto;  }
.image-thumbnails { display: flex; justify-content: center; gap: 10px; margin-top: 20px; }
.thumbnail-item { width: 60px; height: 60px; cursor: pointer; }
.thumbnail-img { width: 100%; height: 100%; object-fit: cover; border-radius: 5px; border: 2px solid #ddd; }
.thumbnail-item:hover .thumbnail-img { border-color: #4a90e2; }
.selected-thumbnail .thumbnail-img { border-color: #4a90e2; box-shadow: 0 0 10px rgba(74,144,226,0.6); }
</style>