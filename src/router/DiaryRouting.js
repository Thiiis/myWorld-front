const routes = [
  {
    path: 'diary',
    component: () => import('@/views/diary/DiaryHome.vue'),
    children: [
      {
        path: '',
        name: 'DiaryList',
        component: () => import('@/views/diary/DiaryListView.vue'),
        meta: { theme: 'diary' }
      },
      {
        path: 'create',
        name: 'DiaryCreate',
        component: () => import('@/views/diary/DiaryCreateView.vue'),
        meta: { theme: 'diary' }

      },
      {
        path: ":id/update",
        name: "DiaryUpdate",
        component: () => import("@/views/diary/DiaryUpdateView.vue"),
        meta: { theme: 'diary' },
        props: true
      },
      {
        path: ":id",
        name: 'DiaryDetail',
        component: () => import("@/views/diary/DiaryDetail.vue"),
        meta: { theme: "diary", hideHeader: true },
        props: true
      }
    ]
  }
];

export default routes;
