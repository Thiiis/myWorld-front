const routes = [
  {
    path: '/myworld/:account',
    component: () => import('@/views/MyWorld/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/MyWorld/Home.vue')
      },
      {
        path: 'diary',
        component: () => import('@/views/MyWorld/Diary.vue')
      },
      {
        path: 'guestboard',
        component: () => import('@/views/MyWorld/Guestboard.vue')
      },
      {
        path: 'friend',
        component: () => import('@/views/MyWorld/Friend.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/Profile/Profile.vue')
      }
    ]
  }
]

export default routes
