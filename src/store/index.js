import axiosConfig from '@/apis/axiosConfig';
import { createStore } from 'vuex'
import diary from '@/store/diary';

const store = createStore({
  state: {
    mid: "",
    account: "",
    jwt: ""
  },
  getters: {
    getMid(state, getters, rootState, rootGetters) {
      return state.mid;
    },
    getAccount(state, getters, rootState, rootGetters) {
      return state.account;
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt;
    }

  },
  mutations: {
    setMid(state, payload) {
      state.mid = payload;
    },
    setAccount(state, payload) {
      state.account = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    }
  },
  actions: {
    loginAction(context, payload) {
      new Promise((resolve, reject) => {
        console.log("payload:", payload);
        resolve({ result: "success", mid: payload.mid, account: payload.account, jwt: payload.jwt });
      })
        .then((data) => {
          console.log(data);
          context.commit("setMid", data.mid);
          context.commit("setAccount", data.account);
          context.commit("setJwt", data.jwt);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //인증 정보 저장
    saveAuth(context, payload) {
      //전역 상태에 저장
      context.commit("setMid", payload.mid);
      context.commit("setAccount", payload.account);
      context.commit("setJwt", payload.jwt);

      //Local 스토리지에 저장(브라우저 재시작할 때도 유지)
      localStorage.setItem("mid", payload.mid);
      localStorage.setItem("account", payload.account);
      localStorage.setItem("jwt", payload.jwt);

      //Axios의 공통 헤더로 Authorization을 추가
      axiosConfig.addAuthHeader(payload.jwt);
    },

    removeAuth(context, payload) {
      //전역 상태에 값 삭제
      context.commit("setMid", "");
      context.commit("setAccount", "");
      context.commit("setJwt", "");

      //Local 스토리지에서 값 삭제
      localStorage.removeItem("mid");
      localStorage.removeItem("account");
      localStorage.removeItem("jwt");

      axiosConfig.removeAuthHeader();
    },

    loadAuth(context, payload) {
      //Local 스토리지에 값 읽기
      const mid = localStorage.getItem("mid") || "";
      const account = localStorage.getItem("account") || "";
      const jwt = localStorage.getItem("jwt") || "";

      //전역 상태 값으로 저장(복원)
      context.commit("setMid", mid);
      context.commit("setAccount", account);
      context.commit("setJwt", jwt);

      //Axios의 공통 헤더로 Authorization을 추가
      if (jwt !== "") {
        axiosConfig.addAuthHeader(jwt);
      }
    }

  },
  //하위 상태
  modules: {
    diary
  }
})

export default store;