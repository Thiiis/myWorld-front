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
  }
];

export default routes;
