<template>
  <router-view v-if="route.name" v-bind="currentRouteProps" @go-to-create="goToCreate" @go-back="goBack" 
  @update:active-folder="updateActiveFolder" @update:folder-type="updateFolderType" @go-page="goToPage"
  />
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

// 검색어와 정렬 상태
const searchQuery = computed({
  get: () => store.state.diary.searchQuery,
  set: (val) => store.commit("diary/setSearchQuery", val),
});

const sortOrder = computed(() => store.state.diary.sortOrder);
const toggleSort = () => store.commit("diary/toggleSort");

// store 기반 props
const currentRouteProps = computed(() => ({
  folders: store.state.diary.folders || [],
  activeFolder: store.state.diary.activeFolder,
  folderType: store.state.diary.folderType,
  currentPage: store.state.diary.currentPage,
  totalPages: store.state.diary.totalPages,
  totalItems: store.state.diary.totalItems,
  searchQuery: store.state.diary.searchQuery,
  sortOrder: store.state.diary.sortOrder,
  toggleSort: () => store.commit("diary/toggleSort"),
}));

// 이벤트 핸들러
const goToCreate = () => router.push({ name: "DiaryCreate" });
const goBack = () => router.back();
const updateActiveFolder = (folderId) => store.commit("diary/setActiveFolder", folderId);
const updateFolderType = (type) => store.commit("diary/setFolderType", type);
const goToPage = (page) => store.dispatch("diary/fetchDiaries", { pageNo: page, hostAccount: route.params.account });
</script>
