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

// 현재 경로에 따라 props를 바인딩 (Diary.vue에만 필요)
const currentRouteProps = computed(() => {
  if (route.name === "DiaryList") {
    return {
      ...dummyProps.value,
      searchQuery: computed({
        get: () => store.state.diary?.searchQuery || "",
        set: (val) => store.commit("diary/setSearchQuery", val),
      }),
      sortOrder: computed(() => store.state.diary?.sortOrder || "asc"),
      toggleSort: () => store.commit("diary/toggleSort"),
    };
  }
  return {};
});

// '새 일기 작성' 버튼 클릭 시 호출됩니다. DiaryList 컴포넌트에서 발생한 'go-to-create' 이벤트를 처리합니다.
const goToCreate = () => { router.push({ name: 'DiaryCreate' }); };
// DiaryCreate 컴포넌트에서 '일기장으로 돌아가기' 버튼 클릭 시 호출됩니다. DiaryCreate 컴포넌트에서 발생한 'go-back' 이벤트를 처리합니다.
const goBack = () => { router.push({ name: 'DiaryList' }); };
// --- Diary.vue에서 사용하는 나머지 이벤트 처리 (예시) ---
const updateActiveFolder = (folderId) => { dummyProps.value.activeFolder = folderId; };
const updateFolderType = (type) => { dummyProps.value.folderType = type; };
const goToPage = (page) => { dummyProps.value.currentPage = page; };
</script>