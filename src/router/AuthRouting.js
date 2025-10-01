
const routes = [
  {
    path: '/signup',
    component: () => import(/* webpackChunkName: "Auth" */ '@/views/Auth/SignupPage.vue')
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Auth" */ '@/views/Auth/LoginPage.vue')
  }
];

export default routes;