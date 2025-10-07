<template>
  <nav class="mt-4">
    <ul class="pagination justify-content-center flex-wrap">
      <!-- 🟦 처음 -->
      <li class="page-item" :class="{ disabled: props.currentPage === 1 }" @click="goPage(1)" >
        <a class="page-link" href="javascript:void(0)">⏮</a>
      </li>
      <!-- ◀ 이전 -->
      <li class="page-item" :class="{ disabled: props.currentPage === 1 }" @click="goPage(props.currentPage - 1)" >
        <a class="page-link" href="javascript:void(0)"> ◀ 이전 </a>
      </li>
      <!-- 🔹 번호 목록 -->
      <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === props.currentPage }" @click="goPage(page)" >
        <a class="page-link" href="javascript:void(0)">{{ page }}</a>
      </li>
      <!-- 다음 ▶ -->
      <li class="page-item" :class="{ disabled: props.currentPage === props.totalPages }" @click="goPage(props.currentPage + 1)" >
        <a class="page-link" href="javascript:void(0)">다음 ▶</a>
      </li>
      <!-- 🟦 마지막 -->
      <li class="page-item" :class="{ disabled: props.currentPage === props.totalPages }" @click="goPage(props.totalPages)" >
        <a class="page-link" href="javascript:void(0)">⏭</a>
      </li>
    </ul>
    <!-- 하단 정보 -->
    <div class="text-muted text-center small mt-2">
      페이지 {{ props.currentPage }} / {{ props.totalPages }}
      (총 {{ props.totalItems }}개의 일기)
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalItems: { type: Number, default: 0 },
});

const emit = defineEmits(["go-page"]);
//✅ 페이지 이동
const goPage = (page) => {
  if (page < 1 || page > props.totalPages) return;
  emit("go-page", page);
};
//✅ 표시할 페이지 그룹 계산 (5개 단위)
const visiblePages = computed(() => {
  const groupSize = 5;
  const total = props.totalPages;
  const currentGroup = Math.ceil(props.currentPage / groupSize);
  const start = (currentGroup - 1) * groupSize + 1;
  const end = Math.min(start + groupSize - 1, total);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>

<style scoped>
.pagination { font-size: 0.9rem; gap: 6px; /* ✅ 버튼 간 간격 */
  flex-wrap: wrap; }
.page-item { cursor: pointer; user-select: none; }
.page-item.disabled .page-link { cursor: not-allowed; opacity: 0.6; }
.page-item.active .page-link { background-color: #0d6efd; border-color: #0d6efd; color: white; }
/* ✅ 각 버튼을 살짝 넓히고 정돈 */
.page-link { color: #0d6efd; border-radius: 6px;
  padding: 6px 12px; /* 버튼 크기 조정 */
  margin: 0 2px; /* 혹시 gap이 지원 안될 때 여유 */
  transition: all 0.15s ease-in-out; }
/* ✅ hover 시 더 부드럽게 */
.page-link:hover { background-color: #e8f0ff; color: #084298; transform: translateY(-1px); }
</style>
