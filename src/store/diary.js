import diaryApi from "@/apis/diarysApi";

export default {
  namespaced: true,

  // -----------------------------
  // state
  // -----------------------------
  state: () => ({
    // 검색/정렬/폴더
    searchQuery: "",
    sortOrder: "asc",
    activeFolder: "all",

    // 목록
    diaryEntries: [],

    // 선택된 일기 (모달)
    selectedEntry: null,

    // 단일 일기 상세 데이터
    did: "",
    title: "",
    content: "",
    createdAt: "",
    updatedAt: ""
  }),

  // -----------------------------
  // getters
  // -----------------------------
  getters: {
    getSearchQuery: state => state.searchQuery,
    getSortOrder: state => state.sortOrder,
    getActiveFolder: state => state.activeFolder,

    getDiaryEntries: state => state.diaryEntries,
    getSelectedEntry: state => state.selectedEntry,

    getDid: state => state.did,
    getTitle: state => state.title,
    getContent: state => state.content,
    getCreatedAt: state => state.createdAt,
    getUpdatedAt: state => state.updatedAt
  },

  // -----------------------------
  // mutations
  // -----------------------------
  mutations: {
    setSearchQuery(state, query) { state.searchQuery = query; },
    toggleSort(state) { state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"; },
    setActiveFolder(state, folder) { state.activeFolder = folder; },

    setDiaryEntries(state, entries) { state.diaryEntries = entries; },
    setSelectedEntry(state, entry) { state.selectedEntry = entry; },

    setDid(state, payload) { state.did = payload; },
    setTitle(state, payload) { state.title = payload; },
    setContent(state, payload) { state.content = payload; },
    setCreatedAt(state, payload) { state.createdAt = payload; },
    setUpdatedAt(state, payload) { state.updatedAt = payload; },

    resetState(state) {
      state.searchQuery = "";
      state.sortOrder = "asc";
      state.activeFolder = "all";
      state.diaryEntries = [];
      state.selectedEntry = null;
      state.did = "";
      state.title = "";
      state.content = "";
      state.createdAt = "";
      state.updatedAt = "";
    }
  },

  // -----------------------------
  // actions
  // -----------------------------
  actions: {
    // 📌 일기 목록 조회
    async fetchDiaries({ commit }, pageNo = 1) {
      try {
        const res = await diaryApi.getDiaries(pageNo);

        const mapped = res.data.map(d => ({
          id: d.did,
      title: d.title,
      content: d.content,
      date: d.createdAt?.split("T")[0],
      // ✅ 대표 이미지
      thumbnail: d.thumbnail?.url || null,
      // ✅ 이미지 첨부만 필터링 (html 같은건 제외)
      images: d.attachments
        ? d.attachments.filter(a => a.atype.startsWith("image")).map(a => a.url)
        : [],
      emo: d.emo,
      weather: d.weather,
      likes: d.likes || 0,
      comments: d.comments || [],
      tags: d.tags || []
        }));

        commit("setDiaryEntries", mapped);
      } catch (e) {
        console.error("일기 목록 불러오기 실패:", e);
      }
    },


    // 📌 단일 일기 상세 조회
    async fetchDiary({ commit }, did) {
      try {
        const res = await diaryApi.getDiary(did);
        commit("setSelectedEntry", res.data);
        // 단일 데이터 state에도 반영
        commit("setDid", res.data.did);
        commit("setTitle", res.data.title);
        commit("setContent", res.data.content);
        commit("setCreatedAt", res.data.createdAt);
        commit("setUpdatedAt", res.data.updatedAt);
      } catch (e) {
        console.error("단일 일기 조회 실패:", e);
      }
    }
  }
};
