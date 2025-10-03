<template>
  <div class="diary-container p-4">
    <!--헤더-->
    <h3 class="fw-bold mb-3">📘 나의 일기장</h3>
    <div>
      <div class="header-top">
        <div class="d-flex align-items-center text-white fw-bold px-3 py-2"> <i class="bi bi-book me-2"></i> 일기장 </div>
      </div>
      <div class="header-box text-center my-4">
        <div class="icon-circle mx-auto mb-3"> <i class="bi bi-book fs-3 text-white"></i> </div>
        <h3 class="fw-bold text-primary mb-1">일기장</h3>
        <p class="text-muted">맑은 하늘처럼 깨끗한 마음으로 기록해보세요</p>
      </div>
    </div>

    <!-- 필터 박스 (폴더 버튼, 태그 버튼 등) -->
    <div class="filter-box d-flex justify-content-between align-items-center flex-wrap mb-3">
      <div class="d-flex gap-2 flex-wrap">
        <!--폴더 버튼: 나중에 폴더별 필터링 기능 추가 예정-->
        <button
          v-for="f in folders"
          :key="f.id"
          class="btn folder-btn"
          :class="{ active: activeFolder === f.id }"
          @click="$emit('update:active-folder', f.id)"
        >
          <i class="bi bi-folder me-1"></i>{{ f.name }}
          <span class="count">{{ f.count }}</span>
        </button>
        
      </div>

      <!-- 태그 버튼 및 폴더 버튼 및 일기작성 버튼 -->
      <div class="d-flex gap-2 align-items-center">
        <!-- 태그 버튼-->
        <button class="btn tab-btn" :class="{ active: folderType === 'tag' }" @click="$emit('update:folder-type', 'tag')"> 태그별 </button>
        <!-- 폴더 버튼-->
        <button class="btn tab-btn" :class="{ active: folderType === 'custom' }" @click="$emit('update:folder-type', 'custom')"> 내폴더 </button>
        <button class="btn btn-primary" @click="goToCreatePage"> <i class="bi bi-pencil-square me-1"></i>새 일기 작성 </button>
      </div>
    </div>

    <!-- 검색 및 정렬 (나중에 기능 추가 예정)-->
    <div class="d-flex gap-2 mb-3">
      <input v-model="store.state.diary.searchQuery" type="text" class="form-control" placeholder="검색어를 입력하세요..." />
      <button class="btn btn-outline-primary" @click="toggleSort">
        <i class="bi me-1" :class="store.state.diary.sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
        {{ store.state.diary.sortOrder === 'asc' ? '오름차순' : '내림차순' }}
      </button>
    </div>
    

    <!-- 일기 목록 -->
    <DiaryCardList :diary-entries="filteredEntries" @open-modal="openModal" />
    <!-- 모달: selectedEntry가 있을 때만 렌더링 -->
    <DiaryModal v-if="store.state.diary.selectedEntry" />
    <!-- 페이지네이션 -->
    <DiaryPage :currentPage="currentPage" :totalPages="totalPages" :totalItems="totalItems" @go-page="$emit('go-page', $event)" />
  </div>
</template>

<script setup>
import DiaryPage from "@/views/Diary/list_components/DiaryPage.vue";
import DiaryCardList from "@/views/Diary/list_components/DiaryCardList.vue"; 
import DiaryModal from "@/views/Diary/modal/DiaryModal.vue";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

// -----------------------------
// Props 정의
// -----------------------------
defineProps({
  folders: Array,
  activeFolder: String,
  folderType: String,
  currentPage: Number,
  totalPages: Number,
  totalItems: Number,
});
// Emits 정의
const emit = defineEmits([ "update:active-folder", "update:folder-type", "go-page", "go-to-create" ]);
// 페이지 이동 함수
const goToCreatePage = () => { emit("go-to-create");  };
// 정렬 순서 토글 함수 (나중에 기능 추가 예정)
const toggleSort = () => { store.commit('diary/toggleSort');  };
// 필터 + 정렬 적용된 일기 목록 computed
const filteredEntries = computed(() => {
  let list = store.state.diary.diaryEntries || [];
  // 검색 필터
  if (store.state.diary.searchQuery) { 
    list = list.filter(e => e.title?.includes(store.state.diary.searchQuery)); 
  }
  // 정렬
  return store.state.diary.sortOrder === "asc" ? list : [...list].reverse();
});

// 모달 열기
const openModal = (entry) => {
  store.commit('diary/setSelectedEntry', entry);
  const modalEl = document.getElementById('diaryModal');
  if (modalEl) {
    // eslint-disable-next-line no-undef
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

// 서버에서 불러오기
onMounted(() => { store.dispatch("diary/fetchDiaries", 1); });
</script>

<style scoped>
.header-top { background: linear-gradient(90deg, #1e90ff, #00bfff); border-radius: 10px 10px 0 0; }
.icon-circle { width: 60px; height: 60px; background: #0d6efd;  border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.folder-btn { border-radius: 25px; padding: 6px 14px; background: #f8faff; color: #0d6efd; border: 1px solid #cfe2ff; font-size: 0.85rem; transition: all 0.2s; }
.folder-btn.active { background: #0d6efd; color: white; }
.diary-container { background: #f9fbff; border-radius: 16px; min-height: 100vh; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
.diary-container * { font-family:  'Segoe UI Emoji',  'Apple Color Emoji',  'Segoe UI Symbol',  'Noto Color Emoji',  sans-serif !important; }
</style>
