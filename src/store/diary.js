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
    updatedAt: "",
    totalPages: 1,
    totalItems: 0,
  }),

  // -----------------------------
  // getters
  // -----------------------------
  getters: {
    getSearchQuery: (state) => state.searchQuery,
    getSortOrder: (state) => state.sortOrder,
    getActiveFolder: (state) => state.activeFolder,

    getDiaryEntries: (state) => state.diaryEntries,
    getSelectedEntry: (state) => state.selectedEntry,

    getDid: (state) => state.did,
    getTitle: (state) => state.title,
    getContent: (state) => state.content,
    getCreatedAt: (state) => state.createdAt,
    getUpdatedAt: (state) => state.updatedAt,
  },

  // -----------------------------
  // mutations
  // -----------------------------
  mutations: {
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    toggleSort(state) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
    setActiveFolder(state, folder) {
      state.activeFolder = folder;
    },

    setDiaryEntries(state, entries) {
      state.diaryEntries = entries;
    },
    setTotalPages(state, pages) {
      state.totalPages = pages;
    },
    setTotalItems(state, items) {
      state.totalItems = items;
    },
    setSelectedEntry(state, entry) {
      state.selectedEntry = entry;
    },

    setDid(state, payload) {
      state.did = payload;
    },
    setTitle(state, payload) {
      state.title = payload;
    },
    setContent(state, payload) {
      state.content = payload;
    },
    setCreatedAt(state, payload) {
      state.createdAt = payload;
    },
    setUpdatedAt(state, payload) {
      state.updatedAt = payload;
    },

    addDiary(state, diary) {
      state.diaryEntries.unshift(diary);
    },
    updateDiary(state, updated) {
      const idx = state.diaryEntries.findIndex((d) => d.id === updated.id);
      if (idx !== -1) state.diaryEntries.splice(idx, 1, updated);
      if (state.selectedEntry?.id === updated.id) {
        state.selectedEntry = updated;
      }
    },
    removeDiary(state, did) {
      state.diaryEntries = state.diaryEntries.filter((d) => d.id !== did);
      if (state.selectedEntry?.id === did) state.selectedEntry = null;
    },

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
    },
  },

  // -----------------------------
  // actions
  // -----------------------------
  actions: {
    /**
     * 📌 일기 목록 조회
     * @param {Number} pageNo 페이지 번호
     * @param {String|null} hostAccount 조회 대상 계정 (ex. member2)
     */
    async fetchDiaries({ commit }, { pageNo = 1, hostAccount = null }) {
      try {
        const res = await diaryApi.getDiaries(pageNo, hostAccount);

        const mapped = res.data.diaries.map((d) => ({
          id: d.did,
          title: d.title,
          content: d.content,
          date: d.createdAt?.split("T")[0],
          thumbnail: d.thumbnail?.url || null,
          images: d.attachments
            ? d.attachments
                .filter((a) => a.atype?.startsWith("image"))
                .map((a) => a.url)
            : [],
          emo: d.emo,
          weather: d.weather,
        }));

        commit("setDiaryEntries", mapped);
        commit("setTotalPages", res.data.totalPages);
        commit("setTotalItems", res.data.totalItems);
      } catch (e) {
        console.error("❌ 일기 목록 불러오기 실패:", e);
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
        console.error("❌ 단일 일기 조회 실패:", e);
      }
    },

    // 📌 생성
    async createDiary({ commit }, formData) {
      try {
        const res = await diaryApi.createDiary(formData);
        commit("addDiary", res.data);
        return res.data;
      } catch (e) {
        console.error("❌ 일기 생성 실패:", e);
      }
    },

    // 📌 수정
    async updateDiary({ commit }, { formData, deleteAids }) {
      try {
        const res = await diaryApi.updateDiary(formData, deleteAids);
        commit("updateDiary", res.data);
        return res.data;
      } catch (e) {
        console.error("❌ 일기 수정 실패:", e);
      }
    },

    // 📌 단일 삭제
    async deleteDiary({ commit }, did) {
      try {
        await diaryApi.deleteDiary(did);
        commit("removeDiary", did);
      } catch (e) {
        console.error("❌ 일기 삭제 실패:", e);
      }
    },

    // 📌 다중 삭제
    async deleteMultipleDiaries({ commit }, dids) {
      try {
        await diaryApi.deleteMultipleDiaries(dids);
        dids.forEach((id) => commit("removeDiary", id));
      } catch (e) {
        console.error("❌ 다중 삭제 실패:", e);
      }
    },
  },
};
