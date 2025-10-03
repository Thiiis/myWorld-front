<template>
  <div class="text-center mt-4">
  <button class="btn btn-link" :disabled="currentPage === 1" @click="goPage(1)">
    &lt;&lt; 맨 처음
  </button>
  
  <button class="btn btn-link" :disabled="currentPage === 1" @click="goPage(currentPage - 1)">
    &lt; 이전
  </button>

  <button 
    v-for="page in visiblePages" 
    :key="page" 
    class="btn mx-1"
    :class="{ 'btn-primary': page === currentPage, 'btn-light': page !== currentPage }"
    @click="goPage(page)">
    {{ page }}
  </button>
  <button class="btn btn-link" :disabled="currentPage === totalPages" @click="goPage(currentPage + 1)">
    다음 &gt;
  </button>

  <button class="btn btn-link" :disabled="currentPage === totalPages" @click="goPage(totalPages)">
    맨 끝 &gt;&gt;
  </button>
  
  <span class="fw-bold mx-2 text-primary d-block d-md-inline">{{ currentPage }} / {{ totalPages }}</span>
  <p class="small mt-2 text-muted">(총 {{ totalItems }}개 일기)</p>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import diaryApi from '@/apis/diarysApi'; // 기존 API 파일

const diaries = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);

const fetchDiaries = async (page = 1) => {
  try {
    const res = await diaryApi.getDiaries(page);
    diaries.value = res.data.diaries;       // diaries 배열
    totalItems.value = res.data.totalItems; // 총 아이템
    totalPages.value = res.data.totalPages; // 총 페이지
    currentPage.value = page;
  } catch (err) {
    console.error("일기 목록 조회 실패:", err);
  }
};

const goPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchDiaries(page);
};

const visiblePages = computed(() => {
  const pageGroupSize = 5; 
  let startPage = Math.max(1, currentPage.value - Math.floor(pageGroupSize / 2));
  let endPage = Math.min(totalPages.value, startPage + pageGroupSize - 1);

  if (endPage - startPage + 1 < pageGroupSize) {
    startPage = Math.max(1, endPage - pageGroupSize + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

onMounted(() => {
  fetchDiaries(1);
});
</script>
