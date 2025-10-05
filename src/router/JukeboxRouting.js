const routes = [
  {
    path: 'jukebox/mysongs',
    component: () => import('@/views/Jukebox/MySongs.vue'),
  },
  {
    path: 'jukebox/search',
    component: () => import('@/views/Jukebox/SearchSong.vue'),
  },
  {
    path: 'jukebox/create',
    component: () => import('@/views/Jukebox/CreateJukebox.vue'),
  },
  {
    path: "jukebox/update/:jid",
    component: () => import("@/views/Jukebox/UpdateJukebox.vue"),
  },
];

export default routes;
