<template>
  <div class="diary-container p-3">
    <!-- 🔹 필터 박스 -->
    <div class="filter-box d-flex justify-content-between align-items-center flex-wrap mb-3">
      <!-- 왼쪽: 폴더 버튼들 -->
      <div class="d-flex gap-2 flex-wrap align-items-center">
        <button v-for="f in folders" :key="f.id" class="btn folder-btn" :class="{ active: activeFolder === f.id }" @click="$emit('update:active-folder', f.id)">
          <i class="bi bi-folder me-1"></i>{{ f.name }}
          <span class="count">{{ f.count }}</span>
        </button>
      </div>

      <!-- 오른쪽: 태그/내폴더/추가 버튼 -->
      <div class="d-flex gap-2 align-items-center">
        <button class="btn tab-btn" :class="{ active: folderType === 'tag' }" @click="$emit('update:folder-type', 'tag')">
          <i class="bi bi-tags me-1"></i> 태그별
        </button>

        <button class="btn tab-btn" :class="{ active: folderType === 'custom' }" @click="$emit('update:folder-type', 'custom')">
          <i class="bi bi-folder2 me-1"></i> 내폴더
        </button>

        <button v-if="folderType === 'custom'" class="btn btn-outline-primary btn-sm" @click="$emit('add-folder')"> + 폴더추가 </button>
      </div>
    </div>

    <!-- 🔹 검색/정렬 -->
    <div class="filter-sort-box mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-primary fw-bold small d-flex align-items-center"><i class="bi bi-search me-1"></i> 검색 & 정렬</span>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-warning btn-sm" :class="{ active: multiSelect }" @click="multiSelect = !multiSelect"> ✓ 다중선택 </button>
          <button v-if="myAccount && hostAccount && isMyHome" class="btn btn-primary btn-sm" @click="goToCreatePage"><i class="bi bi-pencil-square me-1"></i> 새 일기 작성</button>
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
    <div class="diary-grid">
      <div v-for="diary in filteredEntries" :key="diary.id" class="card diary-card p-3" @click="openModal(diary)">
        <div class="img-box">
          <img v-if="diary.thumbnail" :src="diary.thumbnail" alt="일기 대표 이미지" class="img-fluid rounded" />
          <div v-else class="placeholder bg-light d-flex align-items-center justify-content-center"><i class="bi bi-image text-muted fs-2"></i></div>
          <div class="like-badge" :class="{ liked: diary.likedByMe }">
            <i :class="['bi', diary.likedByMe ? 'bi-heart-fill text-danger' : 'bi-heart text-danger']"></i>
            <span>{{ diary.likes ?? 0 }}</span>
          </div>
        </div>
        <div class="card-content p-1 mt-2">
          <div class="title title-center">{{ diary.title || "제목 없음" }}</div>
          <div class="d-flex justify-content-between align-items-center small text-muted mb-1">
            <div>
              <span v-if="getWeatherEmoji(diary).emoji">{{ getWeatherEmoji(diary).emoji }} {{ getWeatherEmoji(diary).label }}</span>
              <span v-if="getMoodEmoji(diary).emoji"> · {{ getMoodEmoji(diary).emoji }} {{ getMoodEmoji(diary).label }}</span>
            </div>
            <div class="text-end">{{ diary.date || "날짜 미정" }}</div>
          </div>
          <p class="small text-dark entry-content">{{ diary.content || "내용이 없습니다." }}</p>

          <div class="d-flex flex-wrap gap-1 mt-2">
            <span v-for="tag in diary.tags" :key="tag" class="badge bg-light text-primary">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 🔹 모달 & 페이지네이션 -->
    <DiaryModal />
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
import router from "@/router";

const props = defineProps({ folders: Array, activeFolder: String, folderType: String, });
const emit = defineEmits(["update:active-folder", "update:folder-type", "go-to-create", "add-folder"]);

const store = useStore();
const route = useRoute();
const sortType = ref("date");
const sortOrder = ref("asc");
const currentPage = ref(1);
const multiSelect = ref(false);

const hostAccount = computed(() => route.params.account);
const myAccount = computed(() => store.state.account);
const isMyHome = computed(() => hostAccount.value === myAccount.value);

const goToCreatePage = () => emit("go-to-create");

//const toggleSort = () => (sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc");

const filteredEntries = computed(() => {
  let list = store.state.diary.diaryEntries || [];
  const q = store.state.diary.searchQuery?.toLowerCase() || "";
  if (q) list = list.filter((e) => e.title?.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q));
  if (sortType.value === "title") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  else if (sortType.value === "content") list.sort((a, b) => (a.content || "").localeCompare(b.content || ""));
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

const EMOJI_MAP = { SUNNY: { emoji: "☀️", label: "맑음" }, CLOUDY: { emoji: "🌥️", label: "흐림" }, RAINY: { emoji: "☔", label: "비" }, SNOWY: { emoji: "❄️", label: "눈" }, HAPPY: { emoji: "😊", label: "기쁨" }, CALM: { emoji: "😌", label: "평온" }, EXCITED: { emoji: "🤩", label: "신남" }, SAD: { emoji: "😥", label: "슬픔" }, };
const getWeatherEmoji = (diary) => EMOJI_MAP[diary.weather] || { emoji: "", label: "" };
const getMoodEmoji = (diary) => EMOJI_MAP[diary.emo] || { emoji: "", label: "" };

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
watch(
  () => store.state.member?.account,
  (newVal) => {
    if (newVal) {
      console.log("로그인 계정 감지됨:", newVal);
    }
  }
);
//모달 열기
const openModal = async (diary) => {
  try {
    // 1️⃣ 상세 데이터 서버에서 가져오기
    store.commit("diary/setSelectedEntry", diary);
    await store.dispatch("diary/fetchDiary", diary.id);
    // 2️⃣ Bootstrap Modal 열기
    const modalEl = document.getElementById("diaryModal");
    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
  } catch (e) {
    console.error("❌ 모달 열기 실패:", e);
  }
};
</script>

<style scoped>
/* ========= 색 · 그림자 토큰 ========= */
:root { --bg-card:#fff; --bg-soft:#f5f8ff; --glass:rgba(255,255,255,.72); --glass-strong:rgba(255,255,255,.88); --ring:0 0 0 1px rgba(13,110,253,.08); --shadow-sm:0 2px 6px rgba(15,23,42,.06); --shadow-md:0 10px 24px rgba(15,23,42,.12); --shadow-lg:0 18px 36px rgba(15,23,42,.16); --grad-1:linear-gradient(135deg,#eef4ff 0%,#eaf7ff 50%,#f9efff 100%); --grad-2:linear-gradient(135deg,#e9f2ff 0%,#edf7ff 55%,#eff5ff 100%); }
/* 컨테이너 · 필터 박스는 기존 톤 유지 */
.diary-container { max-width:1200px; margin:0 auto; }
.filter-box,.filter-sort-box { border:1px solid #e6f0ff; border-radius:14px; background:var(--bg-card); box-shadow:var(--shadow-sm); }
.filter-sort-box .btn,.filter-box .btn { white-space:nowrap; line-height:1; display:inline-flex; align-items:center; gap:6px; }
.search-input { min-width:240px; border-radius:10px; font-size:.9rem; padding:8px 12px; background:#fbfdff; }
.sort-select { min-width:110px; font-size:.85rem; border-radius:10px; }
.bi { font-size:1rem; }
.folder-btn { border-radius:16px; padding:6px 14px; background:#f6f9ff; color:#0d6efd; border:1px solid #cfe2ff; font-size:.85rem; transition:.2s ease; }
.folder-btn:hover { transform:translateY(-1px); box-shadow:var(--shadow-sm); }
.folder-btn.active { background:#0d6efd; color:#fff; border-color:#0d6efd; }
.tab-btn { font-size:.85rem; padding:6px 12px; border:1px solid #d0e2ff; background:#fff; border-radius:12px; transition:.2s ease; }
.tab-btn.active { background:#0d6efd; color:#fff; border-color:#0d6efd; }
/* ========= 카드 ========== */
.diary-card { position:relative; border-radius:18px; overflow:hidden; background:var(--bg-card); border:1px solid rgba(13,110,253,.06); transition:transform .25s, box-shadow .25s, border-color .25s; cursor:pointer; box-shadow:var(--shadow-sm); height:100%; padding:12px!important; font-size:.95rem; backdrop-filter:saturate(110%) blur(2px); }
.diary-card::before { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 40%); }
.diary-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-md); border-color:rgba(13,110,253,.12); }
/* ========= 이미지 박스 ========== */
.img-box { position:relative; height:250px; overflow:hidden; border-radius:14px; background:var(--grad-1); display:flex; align-items:center; justify-content:center; box-shadow:inset 0 1px 0 rgba(255,255,255,.7); transition:transform .4s ease; }
.img-box img { width:100%; height:100%; object-fit:cover; transform:scale(1); transition:transform .5s ease, filter .5s ease; }
.diary-card:hover .img-box img { transform:scale(1.08); filter:brightness(1.05); }
.placeholder { width:100%; height:100%; background:var(--grad-2)!important; border-radius:14px; }
.placeholder .bi { font-size:2rem!important; opacity:.55; }
.img-box::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.12) 100%); pointer-events:none; }
/* ========= 좋아요 배지 ========== */
.like-badge { position:absolute; top:10px; right:10px; background:var(--glass); border:1px solid rgba(255,255,255,.7); border-radius:999px; padding:3px 9px; font-size:.8rem; box-shadow:0 6px 20px rgba(0,0,0,.12), var(--ring); display:inline-flex; align-items:center; gap:6px; backdrop-filter:blur(6px) saturate(120%); }
.like-badge .bi { font-size:.95rem; }
.like-badge.liked { background:rgba(255,240,243,.9); border-color:rgba(255,255,255,.9); }
.like-badge span { font-weight:700; color:#d6336c; }
/* ========= 카드 본문 ========== */
.card-content { padding:8px 2px 2px 2px!important; }
.title { font-weight:700; color:#1f2a44; }
.title-center { text-align:center; }
.card-content .small { font-size:.78rem; color:#6b7280!important; }
.entry-content { overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; min-height:2.6em; color:#334155; }
/* ========= 태그 뱃지 ========== */
.badge.bg-light.text-primary { border:1px solid #dce7ff; background:#f5f8ff!important; color:#3b82f6!important; border-radius:999px; padding:4px 10px; font-weight:600; }
/* ========= 그리드 보정 ========= */
@media (min-width:1400px){ .col-xl-2-5{ flex:0 0 20%; max-width:20%; } }
/* ========= 다크 모드(선택) ========= */
@media (prefers-color-scheme:dark){
  :root { --bg-card:#0b1220; --glass:rgba(15,19,30,.65); --glass-strong:rgba(18,24,38,.8); }
  .filter-box,.filter-sort-box { background:#0b1220; border-color:rgba(88,127,255,.18); }
  .diary-card { background:#0b1220; border-color:rgba(88,127,255,.14); }
  .title { color:#e7ecff; }
  .entry-content { color:#c7d2fe; }
  .card-content .small { color:#9fb2ff!important; }
  .badge.bg-light.text-primary { background:rgba(59,130,246,.12)!important; border-color:rgba(59,130,246,.25); color:#90b4ff!important; }
}
/* ========= 카드 그리드 (3x2 배치) ========= */
.diary-grid { display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,auto); gap:28px; justify-items:center; align-items:start; margin:24px 0 40px; }
.diary-card { width:100%; max-width:330px; min-height:360px; display:flex; flex-direction:column; justify-content:space-between; transition:transform .3s, box-shadow .3s; box-shadow:0 8px 20px rgba(0,0,0,.05), 0 4px 10px rgba(0,0,0,.04), inset 0 1px 0 rgba(255,255,255,.4); height:100%; padding:12px!important; font-size:.95rem; backdrop-filter:saturate(110%) blur(2px); border:1px solid rgba(0,0,0,.04); background:#fffefc; }
.diary-grid .diary-card:nth-child(1){ transform:rotate(-1.2deg); }
.diary-grid .diary-card:nth-child(2){ transform:rotate(0.8deg); }
.diary-grid .diary-card:nth-child(3){ transform:rotate(-0.6deg); }
.diary-grid .diary-card:nth-child(4){ transform:rotate(1deg); }
.diary-grid .diary-card:nth-child(5){ transform:rotate(-0.8deg); }
.diary-grid .diary-card:nth-child(6){ transform:rotate(1.2deg); }
.diary-card:hover{ transform:rotate(0deg) translateY(-6px); border-color:rgba(13,110,253,.12); box-shadow:0 12px 28px rgba(0,0,0,.08), 0 8px 16px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.45); }
@media (max-width:992px){ .diary-grid{ grid-template-columns:repeat(2,1fr); grid-template-rows:auto; } }
@media (max-width:600px){ .diary-grid{ grid-template-columns:repeat(1,1fr); } }
/* ========= 필터 박스: 사진처럼(알약형 + 숫자칩) ========= */
.filter-box { border:1px solid #e7edff; border-radius:14px; background:#fff; box-shadow:0 2px 10px rgba(33,70,255,.06); padding:12px 14px; }
/* 폴더 버튼 */
.folder-btn { display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border-radius:14px; border:1px solid #dbe5ff; background:#fff; color:#4c63ff; font-weight:600; font-size:.9rem; box-shadow:0 1px 0 rgba(255,255,255,.7) inset; transition:background .2s,color .2s,border-color .2s,transform .2s,box-shadow .2s; }
.folder-btn i { font-size:1rem; opacity:.95; }
.folder-btn .count { margin-left:6px; padding:2px 8px; border-radius:999px; background:#eef2ff; color:#5a6bff; font-size:.78rem; font-weight:700; line-height:1; }
.folder-btn:hover { background:#f6f9ff; border-color:#cfe0ff; transform:translateY(-1px); box-shadow:0 4px 14px rgba(33,70,255,.08); }
.folder-btn.active { background:#5a6bff; color:#fff; border-color:#5a6bff; box-shadow:0 6px 18px rgba(33,70,255,.22), inset 0 1px 0 rgba(255,255,255,.25); }
.folder-btn.active i { color:#fff; }
.folder-btn.active .count { background:#3f51ff; color:#fff; }
/* 우측 탭 버튼 */
.tab-btn { padding:8px 12px; border-radius:12px; border:1px solid #dbe5ff; background:#fff; color:#4c63ff; font-weight:700; font-size:.85rem; transition:background .2s,color .2s,border-color .2s,transform .2s; }
.tab-btn i { font-size:.95rem; }
.tab-btn:hover { background:#f6f9ff; border-color:#cfe0ff; transform:translateY(-1px); }
.tab-btn.active { background:#5a6bff; color:#fff; border-color:#5a6bff; box-shadow:0 6px 16px rgba(33,70,255,.18), inset 0 1px 0 rgba(255,255,255,.28); }
.tab-btn.active i { color:#fff; }
/* + 폴더추가 버튼 라이트 톤 */
.btn.btn-outline-primary.btn-sm { border-color:#cfe0ff; color:#4c63ff; background:#fff; }
.btn.btn-outline-primary.btn-sm:hover { background:#f6f9ff; border-color:#bed2ff; color:#3f51ff; }
/* 다크 모드 보정 */
@media (prefers-color-scheme:dark){
  .filter-box { background:#0b1220; border-color:rgba(100,120,255,.22); box-shadow:0 2px 12px rgba(0,0,0,.35); }
  .folder-btn { background:#0f1730; border-color:rgba(100,120,255,.22); color:#9fb2ff; }
  .folder-btn .count { background:rgba(100,120,255,.18); color:#b7c5ff; }
  .folder-btn:hover { background:#111b33; border-color:rgba(120,140,255,.28); }
  .folder-btn.active { background:#5868ff; border-color:#5868ff; color:#fff; box-shadow:0 6px 18px rgba(33,70,255,.25), inset 0 1px 0 rgba(255,255,255,.18); }
  .folder-btn.active .count { background:#4152ff; color:#fff; }
  .tab-btn { background:#0f1730; border-color:rgba(100,120,255,.22); color:#9fb2ff; }
  .tab-btn:hover { background:#111b33; border-color:rgba(120,140,255,.28); }
  .tab-btn.active { background:#5868ff; border-color:#5868ff; color:#fff; }
  .btn.btn-outline-primary.btn-sm { border-color:rgba(100,120,255,.22); color:#9fb2ff; background:#0f1730; }
  .btn.btn-outline-primary.btn-sm:hover { background:#111b33; border-color:rgba(120,140,255,.3); color:#bfd0ff; }
}
</style>
