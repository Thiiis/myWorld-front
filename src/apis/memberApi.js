import axios from "axios";

function memberCreate(member) {
  return axios.post("/members/signup", member);
}

function memberLogin(loginForm) {
  return axios.post("/members/login", loginForm);
}

function memberInfo(account, jwt) {
  return axios.get("/members/detail", {
     params: {account},
     headers: {
      //국제표준
      "Authorization": "Bearer " + jwt
    }
  })
}

const memberApi = {
  memberCreate,
  memberLogin,
  memberInfo
};

export default memberApi;