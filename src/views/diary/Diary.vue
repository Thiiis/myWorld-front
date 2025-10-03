<template>
  <router-view
    v-bind="currentRouteProps"
    @go-to-create="goToCreate"
    @go-back="goBack"
    @update:active-folder="updateActiveFolder"
    @update:folder-type="updateFolderType"
    @go-page="goToPage"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const route = useRoute();
const store = useStore();

// -----------------------------
// 더미 폴더 정보 (나중에 DB 연동 예정)
// -----------------------------
const dummyProps = ref({
  folders: [
    { id: 'all', name: '전체', count: 15 },
    { id: 'trip', name: '여행', count: 5 },
  ],
  activeFolder: 'all',
  folderType: 'tag',
  currentPage: 1,
  totalPages: 5,
  totalItems: 75,
});

// -----------------------------
// 현재 경로에 따라 props 바인딩
// -----------------------------
const currentRouteProps = computed(() => {
  if (route.name === "DiaryList") {
    return {
      ...dummyProps.value,
      searchQuery: computed({
        get: () => store.state.diary.searchQuery,
        set: (val) => store.commit("diary/setSearchQuery", val),
      }),
      sortOrder: computed(() => store.state.diary.sortOrder),
      toggleSort: () => store.commit("diary/toggleSort"),
    };
  }
  return {};
});

// '새 일기 작성' 버튼 클릭 시(라우터 이동)
const goToCreate = () => {  router.push({ name: 'DiaryCreate' });  };
// '일기장으로 돌아가기' 버튼 클릭 시(라우터 이동)
const goBack = () => { router.back(); };
// -----------------------------
// 기타 이벤트
// -----------------------------
const updateActiveFolder = (folderId) => { dummyProps.value.activeFolder = folderId; };
const updateFolderType = (type) => { dummyProps.value.folderType = type; };
const goToPage = (page) => { dummyProps.value.currentPage = page; };
</script>
