import axios from "axios";

function memberSignup(signupForm) {
  return axios.post("/members/signup", signupForm);
}

function memberLogin(loginForm) {
  return axios.post("/members/login", loginForm);
}

function memberDetail(account, jwt) {
  return axios.get("/members/detail", {
     params: {account},
     headers: {
      //국제표준
      "Authorization": "Bearer " + jwt
    }
  })
}

const memberApi = {
  memberSignup,
  memberLogin,
  memberDetail
};

export default memberApi;