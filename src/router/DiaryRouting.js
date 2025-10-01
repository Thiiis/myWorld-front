const routes = [
  {
    path: '/diary',
    component: () => import(/* webpackChunkName: "DiaryLayout" */ '@/views/diary/Diary.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "Diary" */ '@/views/diary/DiaryListView.vue'),
      },
      {
        path: '/create', 
        component: () => import(/* webpackChunkName: "DiaryCreate" */ '@/views/diary/DiaryCreateView.vue'),
      }
    ]
  }
];

export default routes;