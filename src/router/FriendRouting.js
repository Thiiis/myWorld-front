const routes = [
  {
    path: 'friends',
    component: () => import('@/views/Friend/FriendHome.vue'),
    redirect: to => `/myworld/:account/friends/list`,
    children: [
      {
        path: 'list',
        component: () => import('@/views/Friend/FriendList.vue')
      },
      {
        path: 'requests',
        component: () => import('@/views/Friend/FriendRequestList.vue')
      },
      {
        path: 'add',
        component: () => import('@/views/Friend/FriendAdd.vue')
      }
    ]
  }
]

export default routes
