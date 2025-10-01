const routes = [
  {
    path: '/myworld/:memberId/diary', // ✅ memberId 동적 파라미터
    component: () => import('@/views/Diary/Diary.vue'),
    children: [
      {
        path: '', // /myworld/:memberId/diary
        name: 'DiaryList',
        component: () => import('@/views/Diary/DiaryListView.vue'),
      },
      {
        path: 'create', // /myworld/:memberId/diary/create
        name: 'DiaryCreate',
        component: () => import('@/views/Diary/DiaryCreateView.vue'),
      },
      {
        path: "updatet",
        name: "DiaryEdit",
        component: () => import("@/views/Diary/DiaryUpdateView.vue"),
      }
    ]
  }
];

export default routes;
