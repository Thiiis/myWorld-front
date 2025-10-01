import { createStore } from 'vuex';
import axiosConfig from '@/apis/axiosConfig';

const store = createStore({
  state: {
    user: "",
    jwt: ""
  },
  getters: {
    getUser(state, getters, rootState, rootGetters) {
      return state.user;
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt;
    }

  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    }
  },
  actions: {
    loginAction(context, payload) {
      new Promise((reslove, reject) => {
        console.log("payload:", payload);
        reslove({ result: "success", user: payload.mid });
      })
        .then((data) => {
          console.log(data);
          context.commit("setUser", data.user);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //인증 정보 저장
    saveAuth(context, payload) {
      //전역 상태에 저장
      context.commit("setUser", payload.mid);
      context.commit("setJwt", payload.accessToken);

      //Local 스토리지에 저장(브라우저 재시작할 때도 유지)
      localStorage.setItem("user", payload.mid);
      localStorage.setItem("jwt", payload.accessToken);

      //Axios의 공통 헤더로 Authorization을 추가
      axiosConfig.addAuthHeader(payload.accessToken);
    },

    removeAuth(context, payload) {
      //전역 상태에 값 삭제
      context.commit("setUser", "");
      context.commit("setJwt", "");

      //Local 스토리지에서 값 삭제
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");

      axiosConfig.removeAuthHeader();
    },

    loadAuth(context, payload) {
      //Local 스토리지에 값 읽기
      const user = localStorage.getItem("user") || "";
      const jwt = localStorage.getItem("jwt") || "";

      //전역 상태 값으로 저장(복원)
      context.commit("setUser", user);
      context.commit("setJwt", jwt);

      //Axios의 공통 헤더로 Authorization을 추가
      if (jwt !== "") {
        axiosConfig.addAuthHeader(jwt);
      }
    }

  },
  //하위 상태
  modules: {

  }
})

export default store;