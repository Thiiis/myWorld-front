const routes = [
  {
    path: 'diary', 
    component: () => import('@/views/Diary/DiaryHome.vue'),
    children: [
      {
        path: '', 
        name: 'DiaryList',
        component: () => import('@/views/Diary/DiaryListView.vue'),
        meta: { theme: 'diary' }
      },
      {
        path: 'create',
        name: 'DiaryCreate',
        component: () => import('@/views/Diary/DiaryCreateView.vue'),
        meta: { theme: 'diary' }

      },
      {
        path: ":id/update",
        name: "DiaryUpdate",
        component: () => import("@/views/Diary/DiaryUpdateView.vue"),
        meta: { theme: 'diary' },
        props: true
      }
    ]
  }
];

export default routes;
