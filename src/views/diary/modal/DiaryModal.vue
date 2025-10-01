<template>
  <div class="modal fade" id="diaryModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 shadow-lg border-0">

        <div class="modal-header-custom p-4 d-flex flex-column" 
             :class="{ 'has-image': selectedEntry.images.length }">

          <div class="d-flex justify-content-between w-100 mb-3">
            <h5 class="fw-bold modal-title text-white flex-grow-1">
              {{ selectedEntry.title || '일기 제목 없음' }}
            </h5>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-action-icon" title="편집">
                <i class="bi bi-pencil-square"></i> 편집
              </button>
              <button class="btn btn-sm btn-action-icon btn-danger-action" title="삭제">
                <i class="bi bi-trash"></i> 삭제
              </button>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>

          <div class="image-area flex-grow-1 d-flex align-items-center justify-content-center rounded-3 overflow-hidden">
            <img
              v-if="selectedEntry.images.length"
              :src="selectedEntry.images[0]"
              alt="일기 대표 이미지"
              class="img-fluid"
            />
            <div v-else class="placeholder-cloud w-100 h-100 d-flex align-items-center justify-content-center">
                <i class="bi bi-cloud-haze-fill text-white fs-1 opacity-75"></i>
                <p class="mt-3 text-white-50">이미지 없음</p>
            </div>
          </div>

        </div>

        <div class="modal-body p-4">

          <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-like"><i class="bi bi-heart-fill"></i> 5</button>
                <span class="badge rounded-pill bg-light text-secondary">#평온</span>
                <span class="badge rounded-pill bg-light text-secondary">#구름</span>
            </div>
            <p class="text-muted small mb-0">{{ selectedEntry.date || '날짜 미정' }}</p>
          </div>

          <div class="mb-4">
            <h6 class="fw-bold mb-2 text-dark">일기 내용</h6>
            <p class="lead text-dark diary-content">
              {{ selectedEntry.content || '작성된 내용이 없습니다.' }}
            </p>
          </div>

          <CommentList 
            v-if="selectedEntry"
            :comments="selectedEntry.comments || []" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { diaryStore as store } from "@/store/diary";
import CommentList from "./CommentList.vue";

// selectedEntry가 없으면 기본값 제공 (images와 comments도 안전하게 초기화)
const selectedEntry = computed(() => store.state.selectedEntry || { 
  title: "", 
  content: "", 
  date: "", 
  images: [], 
  comments: [] 
});
</script>
