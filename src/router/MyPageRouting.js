const routes = [
  {
    path: '/mypage',
    redirect: '/mypage/default'
  },
  {
    path: '/mypage/:account',
    component: () => import('@/views/MyPage/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/MyPage/Home.vue')
      },
      {
        path: 'diary',
        component: () => import('@/views/MyPage/Diary.vue')
      },
      {
        path: 'guestboard',
        component: () => import('@/views/Guestboard/Guestboard.vue')
      },
      {
        path: 'jukebox',
        component: () => import('@/views/Jukebox/Jukebox.vue')
      },
      {
        path: 'jukebox/create',   // 새 주크박스 만들기
        component: () => import('@/views/Jukebox/CreateJukebox.vue')
      },
      {
        path: 'jukebox/mysongs',  // 나의 음악
        component: () => import('@/views/Jukebox/MySongs.vue')
      },
      {
        path: 'friend',
        component: () => import('@/views/MyPage/Friend.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/MyPage/Profile.vue')
      }
    ]
  }
]

export default routes
