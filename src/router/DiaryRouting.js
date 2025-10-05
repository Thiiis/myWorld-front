const routes = [
  {
    path: 'diary', 
    component: () => import('@/views/Diary/DiaryHome.vue'),
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
        path: ":id/update",
        name: "DiaryUpdate",
        component: () => import("@/views/Diary/DiaryUpdateView.vue"),
        props: true
      }
    ]
  }
];

export default routes;
