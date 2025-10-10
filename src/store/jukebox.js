const jukebox = {
  namespaced: true,
  state: {
    // ✅ 현재 재생 중인 노래 정보
    currentSong: null,
    // ✅ 선택된 주크박스 정보 (선택만 되어 있고 아직 재생 안 할 수도 있음)
    selectedJukebox: null,
    // ✅ 재생 상태 (true: 재생 중 / false: 일시정지)
    isPlaying: false
  },

  getters: {
    // 현재 재생 중인 노래 정보 가져오기
    getCurrentSong(state) {
      return state.currentSong;
    },
    // 선택된 주크박스 정보 가져오기
    getSelectedJukebox(state) {
      return state.selectedJukebox;
    },
    // 재생 여부 가져오기
    getIsPlaying(state) {
      return state.isPlaying;
    }
  },

  mutations: {
    // ✅ 현재 재생 중인 노래 설정
    setCurrentSong(state, song) {
      state.currentSong = song; // { title, artist }
    },

    // ✅ 선택된 주크박스 설정
    setSelectedJukebox(state, jukebox) {
      state.selectedJukebox = jukebox; // { jid, title }
    },

    // ✅ 재생 여부 변경
    setIsPlaying(state, playing) {
      state.isPlaying = playing;
    },

    // ✅ 초기화
    resetJukeboxState(state) {
      state.currentSong = null;
      state.selectedJukebox = null;
      state.isPlaying = false;
    }
  },

  actions: {
    // 필요 시 비동기 처리용 액션도 여기 추가 가능
  }
};

export default jukebox;
