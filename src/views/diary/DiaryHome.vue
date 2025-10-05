<template>
  <router-view
    v-if="route.name"  
    v-bind="currentRouteProps"
    @go-to-create="goToCreate"
    @go-back="goBack"
    @update:active-folder="updateActiveFolder"
    @update:folder-type="updateFolderType"
    @go-page="goToPage"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const dummyProps = ref({
  folders: [
    { id: "all", name: "전체", count: 15 },
    { id: "trip", name: "여행", count: 5 },
  ],
  activeFolder: "all",
  folderType: "tag",
  currentPage: 1,
  totalPages: 5,
  totalItems: 75,
});

const searchQuery = computed({
  get: () => store.state.diary.searchQuery,
  set: (val) => store.commit("diary/setSearchQuery", val),
});

const sortOrder = computed(() => store.state.diary.sortOrder);
const toggleSort = () => store.commit("diary/toggleSort");

const currentRouteProps = computed(() => {
  // ✅ fallback props를 추가해서 항상 렌더링 가능하게
  return {
    ...dummyProps.value,
    searchQuery,
    sortOrder,
    toggleSort,
  };
});

const goToCreate = () => router.push({ name: "DiaryCreate" });
const goBack = () => router.back();
const updateActiveFolder = (folderId) => (dummyProps.value.activeFolder = folderId);
const updateFolderType = (type) => (dummyProps.value.folderType = type);
const goToPage = (page) => (dummyProps.value.currentPage = page);
</script>
