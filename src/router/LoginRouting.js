
const routes = [
  {
    path: '/signup',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/SignupPage.vue')
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/LoginPage.vue')
  }
];

export default routes;