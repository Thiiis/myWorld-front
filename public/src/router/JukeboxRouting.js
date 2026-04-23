const routes = [
  {
    path: 'jukebox/mysongs',
    component: () => import('@/views/Jukebox/MySongs.vue'),
    meta: { theme: 'jukebox' }

  },
  {
    path: 'jukebox/search',
    component: () => import('@/views/Jukebox/SearchSong.vue'),
    meta: { theme: 'jukebox' }

  },
  {
    path: 'jukebox/create',
    component: () => import('@/views/Jukebox/CreateJukebox.vue'),
    meta: { theme: 'jukebox' }

  },
  {
    path: "jukebox/update/:jid",
    component: () => import("@/views/Jukebox/UpdateJukebox.vue"),
    meta: { theme: 'jukebox' }
  },
];

export default routes;
