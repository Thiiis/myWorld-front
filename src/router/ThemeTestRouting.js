
const routes = [
  {
    path: '/themetest',
    component: () => import(/* webpackChunkName: "themeTest" */ '@/views/ThemeTest/index.vue')
  }
];

export default routes;