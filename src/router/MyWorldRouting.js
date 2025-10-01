const routes = [
  {
    path: '/myworld/:account',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: 'guestboard',
        component: () => import('@/views/Guestboard/Guestboard.vue')
      },
      {
        path: 'jukebox',
        component: () => import('@/views/Jukebox/Jukebox.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/Profile/Profile.vue')
      },
      {
        path: 'friend',
        component: () => import('@/views/Friend/FriendHome.vue')
      }
    ]
  }
]

export default routes
