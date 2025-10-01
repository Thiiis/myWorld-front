
const routes = [
  {
    path: '/signup',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Auth/SignupPage.vue')
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Auth/LoginPage.vue')
  }
];

export default routes;