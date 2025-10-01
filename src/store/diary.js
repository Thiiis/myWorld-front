// src/store/diary.js
export default {
  namespaced: true, // 모듈 단위로 네임스페이스
  state: () => ({
    searchQuery: "",
    sortOrder: "asc",
    activeFolder: "all",
    diaryEntries: [],
    selectedEntry: null, // 모달에서 보여줄 일기
  }),
  mutations: {
    setSearchQuery(state, query) { state.searchQuery = query; },
    toggleSort(state) { state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"; },
    setDiaryEntries(state, entries) { state.diaryEntries = entries; },
    setSelectedEntry(state, entry) { state.selectedEntry = entry; }
  },
  actions: {},
  getters: {},
};
