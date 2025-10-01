import { createStore } from 'vuex'

export default createStore({
  state: {
    hostid: "",
    gid: "",
    content: "",
    createdAt: "",
    updatedAt: ""
  },
  getters: {
    getHostid: state => state.hostid,
    getGid: state => state.gid,
    getContent: state => state.content,
    getCreatedAt: state => state.createdAt,
    getUpdatedAt: state => state.updatedAt,
  },
  mutations: {
    setHostid(state, payload) {
      state.hostid = payload;
    },
    setGid(state, payload) {
      state.gid = payload;
    },
    setContent(state, payload) {
      state.content = payload;
    },
    setViewScope(state, payload) {
      state.viewScope = payload;
    },
    setCreatedAt(state, payload) {
      state.createdAt = payload;
    },
    setUpdatedAt(state, payload) {
      state.updatedAt = payload;
    },
    resetState(state) {
      state.hostid = "";
      state.gid = "";
      state.content = "";
      state.createdAt = "";
      state.updatedAt = "";
    }
  },
  actions: {
  },
  modules: {
  }
})
