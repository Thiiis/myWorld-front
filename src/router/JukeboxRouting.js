const routes = [
  {
    path: 'jukebox',
    component: () => import('@/views/Jukebox/Jukebox.vue'),
    children: [
      {
        path: 'mysongs',
        component: () => import('@/views/Jukebox/MySongs.vue'),
      }
    ],
  },
];

export default routes;
