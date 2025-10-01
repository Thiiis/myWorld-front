const routes = [
  {
    path: '/diary',
    component: () => import(/* webpackChunkName: "DiaryLayout" */ '@/views/Diary/Diary.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "Diary" */ '@/views/Diary/DiaryListView.vue'),
      },
      {
        path: '/create', 
        component: () => import(/* webpackChunkName: "DiaryCreate" */ '@/views/Diary/DiaryCreateView.vue'),
      }
    ]
  }
];

export default routes;