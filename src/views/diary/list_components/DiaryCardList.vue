<template>
  <div class="row g-3">
    <div
      v-for="diary in filteredDiaryList"
      :key="diary.id"
      class="col-md-4 col-sm-6"
      @click="openModal(diary)"
    >
      <!-- DiaryCard 시작 -->
      <div class="card diary-card p-3">
        <div class="img-box">
          <img v-if="diary?.thumbnail" :src="diary.thumbnail" alt="일기 대표 이미지" class="img-fluid rounded" />
          <div v-else class="placeholder bg-light d-flex align-items-center justify-content-center">
            <i class="bi bi-image text-muted fs-3"></i>
          </div>
          <div class="like-badge">
            <i class="bi bi-heart-fill text-danger"></i> <span>{{ diary?.likes || 0 }}</span>
          </div>
        </div>

        <div class="card-content p-1 mt-2">
          <h6 class="fw-bold text-primary text-truncate">{{ diary?.title || "제목 없음" }}</h6>
          <p class="small text-muted mb-1">
            {{ diary?.date || "날짜 미정" }}
            <span v-if="getWeatherEmoji(diary).emoji">
              · <span class="diary-emoji">{{ getWeatherEmoji(diary).emoji }}</span> {{ getWeatherEmoji(diary).label }}
            </span>
            <span v-if="getMoodEmoji(diary).emoji">
              · <span class="diary-emoji">{{ getMoodEmoji(diary).emoji }}</span> {{ getMoodEmoji(diary).label }}
            </span>
          </p>
          <p class="small text-dark entry-content">{{ diary?.content || "내용이 없습니다." }}</p>

          <div v-if="diary.attachments?.length" class="attachments-preview mt-2">
            <div v-for="file in diary.attachments" :key="file.aid" class="attachment-item">
              <img v-if="file.fileType?.includes('image')" :src="file.fileUrl" alt="첨부 이미지" class="img-thumbnail" />
              <a v-else :href="file.fileUrl" target="_blank">{{ file.fileName }}</a>
            </div>
          </div>

          <div class="d-flex flex-wrap gap-1 mt-2">
            <span v-for="tag in diary?.tags" :key="tag" class="badge bg-light text-primary">#{{ tag }}</span>
          </div>
        </div>
      </div>
      <!-- DiaryCard 끝 -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";

const store = useStore();

const diaryList = computed(() => store.state.diary?.diaryEntries || []);
const activeFolder = computed(() => store.state.diary?.activeFolder || "all");
const searchQuery = computed(() => store.state.diary?.searchQuery || "");
const sortOrder = computed(() => store.state.diary?.sortOrder || "asc");

const selectedDiary = computed({
  get: () => store.state.diary?.selectedEntry,
  set: (val) => store.commit("diary/setSelectedEntry", val)
});

const filteredDiaryList = computed(() => {
  return diaryList.value
    .filter(diary => {
      if (activeFolder.value !== "all" && diary.folder !== activeFolder.value) return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return diary.title?.toLowerCase().includes(q) || diary.content?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) =>
      sortOrder.value === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
});

// 모달 열기
const openModal = (diary) => {
  selectedDiary.value = diary;
  const modalEl = document.getElementById("diaryModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

// 이모티콘 매핑
const EMOJI_MAP = {
  'SUNNY': { emoji: '☀️', label: '맑음' },
  'CLOUDY': { emoji: '🌥️', label: '흐림' },
  'RAINY': { emoji: '☔', label: '비' },
  'SNOWY': { emoji: '❄️', label: '눈' },
  'HAPPY': { emoji: '😊', label: '기쁨' },
  'CALM': { emoji: '😌', label: '평온' },
  'EXCITED': { emoji: '🤩', label: '신남' },
  'SAD': { emoji: '😥', label: '슬픔' },
};

const getWeatherEmoji = (diary) => EMOJI_MAP[diary.weather] || { emoji: diary.weather, label: '' };
const getMoodEmoji = (diary) => EMOJI_MAP[diary.emo] || { emoji: diary.emo, label: '' };
</script>

<style scoped>
.diary-card { border-radius: 16px; overflow: hidden; background: #fff; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08); height: 100%; }
.diary-card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1); }
.img-box { position: relative; height: 180px; overflow: hidden; border-radius: 10px; }
.placeholder { height: 100%; }
.like-badge { position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); border-radius: 20px; padding: 4px 10px; font-size: 0.8rem; box-shadow: 0 2px 6px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 4px; }
.entry-content { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 2.4em; }
</style>
