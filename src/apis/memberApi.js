import { api } from '@/apis/axiosApi';

function memberSignup(signupForm) {
  return api.post("/members/signup", signupForm);
}

function memberLogin(loginForm) {
  return api.post("/members/login", loginForm);
}

function memberDetail(account, jwt) {
  return api.get("/members/detail", {
     params: {account},
     headers: {
      //국제표준
      "Authorization": "Bearer " + jwt
    }
  })
}

function searchMembers(keyword) {
  return api.get(`/members/search`, { params: { keyword } });
}

const memberApi = {
  memberSignup,
  memberLogin,
  memberDetail,
  searchMembers
};

export default memberApi;