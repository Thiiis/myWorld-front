
const routes = [
  {
    path: '/me',
    component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile/Me.vue')
  },
  {
    path: '/update',
    component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile/LoginPage.vue')
  },
  {
    path: '/update/image',
    component: () => import(/* webpackChunkName: "Profile" */ '@/views/Profile/LoginPage.vue')
  },
];

export default routes;