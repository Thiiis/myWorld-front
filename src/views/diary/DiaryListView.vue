<template>
  <div class="diary-container p-3">
    <!-- 🌤 헤더 -->
    <div>
      <div class="diary-header mb-4">
        <div class="header-top d-flex align-items-center text-white fw-bold px-3 py-2">
          <i class="bi bi-book me-2"></i> 일기장
        </div>
      </div>

      <div class="icon-circle mx-auto mt-3 mb-2">
        <i class="bi bi-book text-white fs-4"></i>
      </div>

      <h5 class="fw-bold text-primary text-center mb-1">일기장</h5>
      <p class="text-muted small text-center">맑은 하늘처럼 깨끗한 마음으로 기록해보세요</p>
    </div>

    <!-- 🔹 필터 박스 -->
    <div class="filter-box d-flex justify-content-between align-items-center flex-wrap mb-3">
      <!-- 왼쪽: 폴더 버튼들 -->
      <div class="d-flex gap-2 flex-wrap align-items-center">
        <button v-for="f in folders" :key="f.id" class="btn folder-btn" :class="{ active: activeFolder === f.id }" @click="$emit('update:active-folder', f.id)" >
          <i class="bi bi-folder me-1"></i>{{ f.name }}
          <span class="count">{{ f.count }}</span>
        </button>
      </div>

      <!-- 오른쪽: 태그/내폴더/추가 버튼 -->
      <div class="d-flex gap-2 align-items-center">
        <button class="btn tab-btn" :class="{ active: folderType === 'tag' }" @click="$emit('update:folder-type', 'tag')" >
          <i class="bi bi-tags me-1"></i> 태그별
        </button>

        <button class="btn tab-btn" :class="{ active: folderType === 'custom' }" @click="$emit('update:folder-type', 'custom')" >
          <i class="bi bi-folder2 me-1"></i> 내폴더
        </button>

        <button v-if="folderType === 'custom'" class="btn btn-outline-primary btn-sm" @click="$emit('add-folder')" > + 폴더추가 </button>
      </div>
    </div>

    <!-- 🔹 검색/정렬 -->
    <div class="filter-sort-box mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-primary fw-bold small d-flex align-items-center"> <i class="bi bi-search me-1"></i> 검색 & 정렬 </span>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-warning btn-sm" :class="{ active: multiSelect }" @click="multiSelect = !multiSelect" > ✓ 다중선택 </button>
          <button class="btn btn-primary btn-sm" @click="goToCreatePage"> <i class="bi bi-pencil-square me-1"></i> 새 일기 작성 </button>
        </div>
      </div>

      <!-- 검색창 + 정렬 -->
      <div class="d-flex align-items-center gap-2">
        <input v-model="store.state.diary.searchQuery" type="text" class="form-control form-control-sm search-input flex-grow-1" placeholder="검색어를 입력하세요..." />

        <select v-model="sortType" class="form-select form-select-sm sort-select">
          <option value="date">날짜별</option>
          <option value="title">제목별</option>
          <option value="content">내용별</option>
        </select>

        <button class="btn btn-sm btn-outline-primary ms-auto" @click="toggleSort">
          <i class="bi me-1" :class="sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
          {{ sortOrder === 'asc' ? '오름차순' : '내림차순' }}
        </button>
      </div>
    </div>

    <!-- 🔹 일기 카드 목록 -->
    <div class="row g-3">
      <div v-for="diary in filteredEntries" :key="diary.id" class="col-md-4 col-sm-6" @click="openModal(diary)" >
        <div class="card diary-card p-3">
          
          <div class="img-box">
            <img v-if="diary.thumbnail" :src="diary.thumbnail" alt="일기 대표 이미지" class="img-fluid rounded" />
            <div v-else class="placeholder bg-light d-flex align-items-center justify-content-center" > <i class="bi bi-image text-muted fs-2"></i> </div>
            <!-- 좋아요 배지 -->
            <div class="like-badge"> <i class="bi bi-heart-fill text-danger"></i> <span>{{ diary.likes || 0 }}</span> </div>
          </div>

          <div class="card-content p-1 mt-2">
            <h6 class="fw-bold text-primary text-truncate"> {{ diary.title || "제목 없음" }} </h6>
            <div class="d-flex justify-content-between align-items-center small text-muted mb-1" >
              <div>
                <span v-if="getWeatherEmoji(diary).emoji">
                  {{ getWeatherEmoji(diary).emoji }}
                  {{ getWeatherEmoji(diary).label }}
                </span>
                <span v-if="getMoodEmoji(diary).emoji">
                  · {{ getMoodEmoji(diary).emoji }}
                  {{ getMoodEmoji(diary).label }}
                </span>
              </div>
              <div class="text-end"> {{ diary.date || "날짜 미정" }} </div>
            </div>
            <p class="small text-dark entry-content"> {{ diary.content || "내용이 없습니다." }} </p>

            <div class="d-flex flex-wrap gap-1 mt-2">
              <span v-for="tag in diary.tags" :key="tag" class="badge bg-light text-primary" >#{{ tag }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 🔹 모달 & 페이지네이션 -->
    <DiaryModal v-if="store.state.diary.selectedEntry" />
    <DiaryPage :currentPage="currentPage" :totalPages="totalPages" :totalItems="totalItems" @go-page="goPage" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import * as bootstrap from "bootstrap";
import DiaryModal from "@/views/Diary/list_components/DiaryModal.vue";
import DiaryPage from "@/views/Diary/list_components/DiaryPage.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  folders: Array,
  activeFolder: String,
  folderType: String,
});
const emit = defineEmits(["update:active-folder", "update:folder-type", "go-to-create", "add-folder"]);

const store = useStore();
const route = useRoute();
const sortType = ref("date");
const sortOrder = ref("asc");
const currentPage = ref(1);
const multiSelect = ref(false);

const goToCreatePage = () => emit("go-to-create");
const toggleSort = () => (sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc");

const filteredEntries = computed(() => {
  let list = store.state.diary.diaryEntries || [];
  const q = store.state.diary.searchQuery?.toLowerCase() || "";

  if (q)
    list = list.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.content?.toLowerCase().includes(q)
    );

  if (sortType.value === "title")
    list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  else if (sortType.value === "content")
    list.sort((a, b) => (a.content || "").localeCompare(b.content || ""));
  else list.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (sortOrder.value === "desc") list.reverse();
  return list;
});

const totalPages = computed(() => store.state.diary.totalPages || 1);
const totalItems = computed(() => store.state.diary.totalItems || 0);

const goPage = async (page) => {
  if (page < 1 || page > totalPages.value) return;
  const account = route.params.account; // ✅ URL에 있는 계정명
  await store.dispatch("diary/fetchDiaries", { pageNo: page, hostAccount: account });
  currentPage.value = page;
};

const EMOJI_MAP = {
  SUNNY: { emoji: "☀️", label: "맑음" },
  CLOUDY: { emoji: "🌥️", label: "흐림" },
  RAINY: { emoji: "☔", label: "비" },
  SNOWY: { emoji: "❄️", label: "눈" },
  HAPPY: { emoji: "😊", label: "기쁨" },
  CALM: { emoji: "😌", label: "평온" },
  EXCITED: { emoji: "🤩", label: "신남" },
  SAD: { emoji: "😥", label: "슬픔" },
};

const getWeatherEmoji = (diary) =>
  EMOJI_MAP[diary.weather] || { emoji: "", label: "" };
const getMoodEmoji = (diary) =>
  EMOJI_MAP[diary.emo] || { emoji: "", label: "" };

const openModal = async (entry) => { 
  try {
    // 1. Vuex에 선택된 일기 ID 저장 (모달 내에서 상세 데이터 다시 로드하기 위함)
    store.commit("diary/setSelectedEntry", entry); // entry를 바로 setSelectedEntry로 커밋
    // 2. 상세 정보 다시 로드 (attachments 등 모든 정보 포함)
    await store.dispatch("diary/fetchDiary", entry.id); // 🚨 await로 완료를 기다림
    // 3. 상세 정보 로드가 완료된 후 모달 열기
    const modalEl = document.getElementById("diaryModal");
    if (modalEl) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  } catch (error) {
    console.error("모달 열기 실패:", error);
  }
};

// ✅ hostAccount 기반으로 일기 불러오기
onMounted(async () => {
  const account = route.params.account; // 예: member1, member2
  await store.dispatch("diary/fetchDiaries", { pageNo: 1, hostAccount: account });
});

// ✅ 라우트 바뀔 때도 새로 로드 (다른 사람 미니홈피 이동 시)
watch(
  () => route.params.account,
  async (newAccount) => {
    if (newAccount) {
      await store.dispatch("diary/fetchDiaries", { pageNo: 1, hostAccount: newAccount });
      currentPage.value = 1;
    }
  }
);
</script>

<style scoped>
.header-top { background: linear-gradient(90deg, #1e90ff, #00bfff); border-radius: 8px 8px 0 0; font-size: 0.9rem; height: 40px; }
.icon-circle { width: 50px; height: 50px; background: #0d6efd; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); }
.filter-box, .filter-sort-box { border: 1px solid #e6f0ff; border-radius: 8px; background: #fff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04); }
.search-input { min-width: 300px; border-radius: 6px; font-size: 0.85rem; padding: 6px 10px; }
.sort-select { max-width: 120px; font-size: 0.8rem; }
.folder-btn { border-radius: 16px; padding: 5px 12px; background: #f8faff; color: #0d6efd; border: 1px solid #cfe2ff; font-size: 0.8rem; }
.folder-btn.active { background: #0d6efd; color: white; }
.tab-btn { font-size: 0.8rem; padding: 5px 12px; border: 1px solid #d0e2ff; background: #fff; border-radius: 6px; }
.tab-btn.active { background: #0d6efd; color: #fff; border-color: #0d6efd; }
.diary-card { border-radius: 16px; overflow: hidden; background: #fff; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08); height: 100%; }
.diary-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12); }
.img-box { position: relative; height: 160px; overflow: hidden; border-radius: 10px; background: #f9fbff; display: flex; align-items: center; justify-content: center; }
.like-badge { position: absolute; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 4px 10px; font-size: 0.8rem; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); display: flex; align-items: center; gap: 4px; }
.entry-content { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 2.4em; }
</style>