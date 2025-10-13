import diaryApi from "@/apis/diaryApi";

export default {
  namespaced: true,
  state: () => ({
    searchQuery: "", sortOrder: "asc", activeFolder: "all",                                       // 검색/정렬/폴더
    diaryEntries: [],                                                                             // 목록
    selectedEntry: null,                                                                          // 선택된 일기 (모달)
    did: "", title: "", content: "", createdAt: "", updatedAt: "", totalPages: 1, totalItems: 0,  // 단일 일기 상세 데이터
    // 🔻 [추가] 댓글 상태 (현재 선택된 did 기준)
    comments: [],
    commentsLoading: false,
    commentsError: null,
    editingCommentId: null,
    // 🔻 [추가]
    likes: 0,          // 총 좋아요 개수
    likedByMe: false,  // 내가 좋아요 눌렀는지 여부
  }),
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
    // 🔻 [추가] 댓글 getters
    comments: (state) => state.comments,
    commentsLoading: (state) => state.commentsLoading,
    commentsError: (state) => state.commentsError,
    editingCommentId: (state) => state.editingCommentId,
    commentCount: (state) => state.comments.length,
  },
  mutations: {
    setSearchQuery(state, query) { state.searchQuery = query; },
    toggleSort(state) { state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"; },
    setActiveFolder(state, folder) { state.activeFolder = folder; },
    setDiaryEntries(state, entries) { state.diaryEntries = entries; },
    setTotalPages(state, pages) { state.totalPages = pages; },
    setTotalItems(state, items) { state.totalItems = items; },
    setSelectedEntry(state, entry) { state.selectedEntry = entry;},
    setDid(state, payload) { state.did = payload; },
    setTitle(state, payload) { state.title = payload; },
    setContent(state, payload) { state.content = payload; },
    setCreatedAt(state, payload) { state.createdAt = payload; },
    setUpdatedAt(state, payload) { state.updatedAt = payload; },    
    addDiary(state, diary) { state.diaryEntries.unshift(diary); },
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
      // 🔻 [추가] 댓글 초기화
      state.comments = [];
      state.commentsLoading = false;
      state.commentsError = null;
      state.editingCommentId = null;
    },
    // 🔻 [추가] 좋아요 상태를 서버 응답 그대로 반영
    setLikeStateDirect(state, { did, likes, likedByMe }) {
      const didNum = Number(did);

      // 목록 반영
      const i = state.diaryEntries.findIndex(d => Number(d.id) === didNum);
      if (i !== -1) state.diaryEntries.splice(i, 1, {
        ...state.diaryEntries[i],
        likes,
        likedByMe
      });

      // 상세 반영
      const selectedDid = state.selectedEntry
        ? Number(state.selectedEntry.did ?? state.selectedEntry.id)
        : null;
      if (selectedDid === didNum) {
        state.selectedEntry = { ...state.selectedEntry, likes, likedByMe };
      }
      state.likes = likes;
      state.likedByMe = likedByMe;
    },
    // 🔻 [추가] 댓글 뮤테이션
    setCommentsLoading(state, flag) { state.commentsLoading = flag; },
    setCommentsError(state, err) { state.commentsError = err; },
    setComments(state, list) { state.comments = list; },
    addComment(state, c) { state.comments.unshift(c); },
    updateComment(state, updated) {
      const idx = state.comments.findIndex((c) => c.dcid === updated.dcid);
      if (idx !== -1) state.comments.splice(idx, 1, updated);
    },
    removeComment(state, dcid) { state.comments = state.comments.filter((c) => c.dcid !== dcid); },
    setEditingCommentId(state, dcid) { state.editingCommentId = dcid; },
    clearEditingCommentId(state) { state.editingCommentId = null; },
  },

  actions: {
    //📌 일기 목록 조회 //@param {Number} pageNo 페이지 번호 // @param {String|null} hostAccount 조회 대상 계정 (ex. member2)
    async fetchDiaries({ commit }, { pageNo = 1, hostAccount = null }) {
      try {
        const res = await diaryApi.getDiaries(pageNo, hostAccount);

        const mapped = res.data.diaries.map((d) => ({
          id: d.did,
          mid: d.mid,
          title: d.title,
          content: d.content,
          date: d.createdAt?.split("T")[0],
          thumbnail: d.thumbnail?.url || null,
          images: d.attachments ? d.attachments.filter((a) => a.atype?.startsWith("image")).map((a) => a.url) : [],
          emo: d.emo,
          weather: d.weather,
          likes: d.likes ?? 0,
          likedByMe: d.likedByMe ?? false,
        }));

        commit("setDiaryEntries", mapped);
        commit("setTotalPages", res.data.totalPages);
        commit("setTotalItems", res.data.totalItems);
      } catch (e) {
        console.error("❌ 일기 목록 불러오기 실패:", e);
      }
    },

    // 📌 단일 일기 상세 조회
    async fetchDiary({ commit, dispatch }, did) {
      try {
        const res = await diaryApi.getDiary(did);
        const date = res.data.createdAt?.split("T")[0];  // ✅ createdAt을 YYYY-MM-DD 형식으로 가공
        commit("setSelectedEntry", { ...res.data, date, likes: res.data.likes ?? 0, likedByMe: res.data.likedByMe ?? false, }); // 좋아요 정보 포함
        // 단일 데이터 state에도 반영
        commit("setDid", res.data.did);
        commit("setTitle", res.data.title);
        commit("setContent", res.data.content);
        commit("setCreatedAt", res.data.createdAt);
        commit("setUpdatedAt", res.data.updatedAt);
        

        await dispatch("fetchComments", did);
      } catch (e) {
        console.error("❌ 단일 일기 조회 실패:", e);
      }
    },
    // 📌 생성
    async createDiary({ commit }, { formData, hostAccount = null }) {
      try {
        const res = await diaryApi.createDiary(formData, hostAccount);
        commit("addDiary", res.data);
        return res.data;
      } catch (e) {
        console.error("❌ 일기 생성 실패:", e);
      }
    },
    // 📌 수정
    async updateDiary({ commit }, { formData, deleteAids = [], hostAccount = null }) {
      try {
        // diaryApi.updateDiary는 params 객체로 deleteAids, hostAccount 전달
        const res = await diaryApi.updateDiary(formData, deleteAids, hostAccount);
        // Vuex state 갱신
        const updatedDiary = {
          id: res.data.did,
          mid: res.data.mid,
          title: res.data.title,
          content: res.data.content,
          date: res.data.createdAt?.split("T")[0],
          thumbnail: res.data.thumbnail?.url || null,
          images: res.data.attachments ? res.data.attachments .filter((a) => a.atype?.startsWith("image")) .map((a) => a.url) : [],
          emo: res.data.emo,
          weather: res.data.weather,
        };

        commit("updateDiary", updatedDiary);
        return updatedDiary;
      } catch (e) {
        console.error("❌ 일기 수정 실패:", e);
      }
    },
    // 📌 단일 삭제
    async deleteDiary({ commit, state }, { did, hostAccount = null }) {
      try {
        await diaryApi.deleteDiary(did, hostAccount);
        commit("removeDiary", did);
        if (state.did === did) commit("setComments", []);
      } catch (e) {
        console.error("❌ 일기 삭제 실패:", e);
      }
    },
    // 📌 다중 삭제
    async deleteMultipleDiaries({ commit }, { dids, hostAccount = null }) {
      try {
        await diaryApi.deleteMultipleDiaries(dids, hostAccount);
        dids.forEach((id) => commit("removeDiary", id));
      } catch (e) {
        console.error("❌ 다중 삭제 실패:", e);
      }
    },
    // 🔻 [추가] 좋아요 토글 액션
    async toggleLike({ state, commit }, did) {
    const didNum = Number(did);

    // 현재 상태 파악
    const inList   = state.diaryEntries.find(d => Number(d.id) === didNum);
    const inDetail = state.selectedEntry &&
                    Number(state.selectedEntry.did ?? state.selectedEntry.id) === didNum
                      ? state.selectedEntry : null;
    const base = inDetail ?? inList ?? { likes: 0, likedByMe: false };
    const currentlyLiked = !!base.likedByMe;

    try {
      // 현재 상태에 따라 API 선택
      // 여기서 res는 {likes, likedByMe} (위 1번 변경을 적용했기 때문)
      const res = currentlyLiked
        ? await diaryApi.unlikeDiary(didNum)
        : await diaryApi.likeDiary(didNum);

      // 응답이 객체면 그대로 반영
      if (res && typeof res.likedByMe !== "undefined") {
        commit("setLikeStateDirect", {
          did: didNum,
          likes: res.likes ?? 0,
          likedByMe: !!res.likedByMe,
        });
      } else {
        // 🔁 응답이 비어오면 낙관 토글로 처리
        const likedByMe = !currentlyLiked;
        const likes = Math.max(0, (base.likes ?? 0) + (likedByMe ? 1 : -1));
        commit("setLikeStateDirect", { did: didNum, likes, likedByMe });
      }
      } catch (e) {
        console.error("❌ 좋아요 토글 실패:", e);
        // 실패 시엔 기존 상태 유지 (원하면 롤백도 가능)
      }
    },
    
   // 댓글 목록
    async fetchComments({ commit }, did) {
      commit("setCommentsLoading", true);
      commit("setCommentsError", null);
      try {
        const { data } = await diaryApi.getDiaryComments(did);
        // data: DiarysCommentResponse[]
        const mapped = data.map(c => ({
          dcid: c.dcid,
          did: c.did,
          mine: !!c.mine,
          content: c.content,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
        commit("setComments", mapped);
      } catch (e) {
        console.error("❌ 댓글 목록 불러오기 실패:", e);
        commit("setCommentsError", e);
      } finally {
        commit("setCommentsLoading", false);
      }
    },

    // 댓글 생성
    async createComment({ commit }, { did, content }) {
      try {
        const { data } = await diaryApi.createDiaryComment(did, { content });
        // data: DiarysCommentResponse (백엔드 생성 시 단건 반환)
        const created = {
          dcid: data.dcid,
          did: data.did,
          mine: !!data.mine,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        commit("addComment", created);
        return created;
      } catch (e) {
        console.error("❌ 댓글 생성 실패:", e);
        throw e;
      }
    },

    // 댓글 수정 (백엔드가 수정 후 수정된 댓글을 응답)
    async updateComment({ commit }, { did, dcid, content }) {
      try {
        commit("setEditingCommentId", dcid);
        const { data } = await diaryApi.updateDiaryComment(did, dcid, { content });
        const updated = {
          dcid: data.dcid,
          did: data.did,
          mine: !!data.mine,
          content: data.content,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        commit("updateComment", updated);
        return updated;
      } catch (e) {
        console.error("❌ 댓글 수정 실패:", e);
        throw e;
      } finally {
        commit("clearEditingCommentId");
      }
    },

    // 댓글 삭제
    async deleteComment({ commit }, { did, dcid }) {
      try {
        await diaryApi.deleteDiaryComment(did, dcid);
        commit("removeComment", dcid);
      } catch (e) {
        console.error("❌ 댓글 삭제 실패:", e);
        throw e;
      }
    },

    
  },
};