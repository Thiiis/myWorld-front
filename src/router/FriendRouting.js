const routes = [
  {
    path: 'friends',
    component: () => import('@/views/Friend/FriendHome.vue'),
    redirect: to => `/myworld/:account/friends/list`,
    children: [
      {
        path: 'list',
        component: () => import('@/views/Friend/FriendList.vue'),
        meta: { theme: 'friend' }

      },
      {
        path: 'requests',
        component: () => import('@/views/Friend/FriendRequestList.vue'),
        meta: { theme: 'friend' }

      },
      {
        path: 'add',
        component: () => import('@/views/Friend/FriendAdd.vue'),
        meta: { theme: 'friend' }
      }
    ]
  }
]

export default routes
