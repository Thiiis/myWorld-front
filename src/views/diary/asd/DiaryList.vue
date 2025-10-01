<template>
  <div>
    <!-- 다중 선택 툴바 -->
    <div v-if="multiSelectMode" class="multi-bar d-flex gap-2 mb-3">
      <button class="btn btn-warning" @click="exitMultiSelect">선택완료</button>
      <button class="btn btn-danger" :disabled="!selectedEntries.length" @click="deleteSelected">
        선택 삭제 ({{ selectedEntries.length }})
      </button>
      <button class="btn btn-outline-secondary" @click="toggleSelectAll">
        {{ isAllSelected ? "전체해제" : "전체선택" }}
      </button>
    </div>

    <!-- 카드 리스트 -->
    <div class="row g-3">
      <DiaryCard v-for="entry in currentEntries" :key="entry.id" :entry="entry" :multiSelectMode="multiSelectMode" :selectedEntries="selectedEntries" @toggleSelect="toggleSelect" @openEntry="openEntry" />
    </div>

    <!-- 페이지네이션 -->
    <div class="text-center mt-4">
      <button class="btn btn-link" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">이전</button>
      <span class="fw-bold mx-2">{{ currentPage }}</span>
      <button class="btn btn-link" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">다음</button>
    </div>

    <!-- 상세 모달 -->
    <DiaryDetail v-if="selectedEntry" :entry="selectedEntry" @close="selectedEntry = null" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import DiaryCard from "@/views/diary/DiaryCard.vue";
import DiaryDetail from "@/views/MyPage/diary/DiaryDetail.vue";

const diaryEntries = ref([
  { id: 1, title: "오늘의 하늘", date: "2024.12.17", content: "기분 좋은 날", likes: 5, images: ["https://via.placeholder.com/300"], tags: ["일상"], moodEmoji: "😊", weatherEmoji: "☀️", comments: [] }
]);

// 페이지
const currentPage = ref(1);
const itemsPerPage = 6;
const totalPages = computed(() => Math.ceil(diaryEntries.value.length / itemsPerPage) || 1);
const currentEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return diaryEntries.value.slice(start, start + itemsPerPage);
});
const goToPage = (p) => { if (p >= 1 && p <= totalPages.value) currentPage.value = p; };

// 다중선택
const multiSelectMode = ref(false);
const selectedEntries = ref([]);
const isAllSelected = computed(() => selectedEntries.value.length === currentEntries.value.length);
const toggleSelect = (id, checked) => {
  if (checked) selectedEntries.value.push(id);
  else selectedEntries.value = selectedEntries.value.filter(i => i !== id);
};
const toggleSelectAll = () => {
  if (isAllSelected.value) selectedEntries.value = [];
  else selectedEntries.value = currentEntries.value.map(e => e.id);
};
const deleteSelected = () => {
  diaryEntries.value = diaryEntries.value.filter(e => !selectedEntries.value.includes(e.id));
  selectedEntries.value = [];
};
const enterMultiSelect = () => multiSelectMode.value = true;
const exitMultiSelect = () => multiSelectMode.value = false;

// 상세 모달
const selectedEntry = ref(null);
const openEntry = (entry) => selectedEntry.value = entry;
</script>

<!-- <template>
  <div>
    <button @click="$emit('createEntry')">새 일기 작성</button>
    <button @click="deleteSelected" :disabled="!selectedEntries.length">선택 삭제</button>

    <div v-for="entry in pagedEntries" :key="entry.id" style="margin-bottom: 10px; border-bottom:1px solid #ccc; padding:5px;">
      <input type="checkbox" v-model="selectedEntries" :value="entry.id" />

      <span @click="$emit('selectEntry', entry)" style="cursor:pointer; font-weight:bold; margin-right:10px;">
        {{ entry.title }}
      </span>

      <span style="margin-right:10px;">📅 {{ entry.date }}</span>
      <span style="margin-right:10px;">{{ moodEmoji(entry.mood) }} {{ entry.mood }}</span>
      <span style="margin-right:10px;">{{ weatherEmoji(entry.weather) }} {{ entry.weather }}</span>
      <span>❤️ {{ entry.likes }}</span>
    </div>

    <div style="margin-top:10px;">
      <button @click="prevPage" :disabled="currentPage===1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage===totalPages">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['diaryEntries']);
const emit = defineEmits(['multiDelete', 'selectEntry', 'createEntry']);

const currentPage = ref(1);
const itemsPerPage = 5;
const selectedEntries = ref([]);

const totalPages = computed(() => Math.ceil(props.diaryEntries.length / itemsPerPage));
const pagedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return props.diaryEntries.slice(start, start + itemsPerPage);
});

const nextPage = () => { if(currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if(currentPage.value > 1) currentPage.value--; };

const deleteSelected = () => {
  if (selectedEntries.value.length) emit('multiDelete', selectedEntries.value);
  selectedEntries.value = [];
};

const moodEmoji = (mood) => {
  switch(mood){
    case 'happy': return '😊';
    case 'calm': return '😌';
    case 'excited': return '🤗';
    case 'sad': return '😢';
    default: return '';
  }
};

const weatherEmoji = (weather) => {
  switch(weather){
    case 'sunny': return '☀️';
    case 'cloudy': return '☁️';
    case 'rainy': return '🌧️';
    case 'snowy': return '❄️';
    default: return '';
  }
};
</script> -->
