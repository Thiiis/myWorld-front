const chat = {
  namespaced: true,
  state: {  
    openRooms: [],
    activeRooms: [],
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
       if (!state.activeRooms.includes(room.id)) {
        state.activeRooms.push(room.id);
      }
    },
    removeOpenRoom(state, roomId) {
      state.openRooms = state.openRooms.filter(r => r.id !== roomId);
      state.activeRooms = state.activeRooms.filter(id => id !== roomId);
    },
    increaseUnread(state, roomId) {
     const room = state.openRooms.find(r => r.id === roomId);
     if (room) {
      room.unreadCount = (room.unreadCount || 0) + 1;
     }
    },
    clearUnread(state, roomId) {
     const room = state.openRooms.find(r => r.id === roomId);
      if (room) {
       room.unreadCount = 0;
      }
    }
  },
  actions: {
  }
};

export default chat;