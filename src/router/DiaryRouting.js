const routes = [
  {
    path: 'diary', 
    component: () => import('@/views/Diary/Diary.vue'),
    children: [
      {
        path: '', 
        name: 'DiaryList',
        component: () => import('@/views/Diary/DiaryListView.vue'),
      },
      {
        path: 'create',
        name: 'DiaryCreate',
        component: () => import('@/views/Diary/DiaryCreateView.vue'),
      },
      {
        path: "update",
        name: "DiaryEdit",
        component: () => import("@/views/Diary/DiaryUpdateView.vue"),
      }
    ]
  }
];

export default routes;
