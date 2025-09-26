const routes = [
  {
    path: '/mypage',
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
        component: () => import('@/views/MyPage/Guestboard.vue')
      },
      {
        path: 'jukebox',
        component: () => import('@/views/MyPage/Jukebox.vue')
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
