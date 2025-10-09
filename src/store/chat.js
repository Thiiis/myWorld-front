const chat = {
  namespaced: true,
  state: {  
    openRooms: []  
  },
  getters: {
    getOpenRooms(state, getters, rootstate, rootGetters) {
      return state.openRooms;
    }
  },
  mutations: {
    setOpenRooms(state, rooms) {
      state.openRooms = rooms;
    },
    addOpenRoom(state, room) {
      const exist = state.openRooms.find(r => r.id === room.id);
      if (!exist) {
        state.openRooms.push(room);
      }
    },
    removeOpenRoom(state, roomId) {
      state.openRooms = state.openRooms.filter(r => r.id !== roomId);
    }
  },
  actions: {
  }
};

export default chat;