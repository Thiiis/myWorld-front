const routes = [
  {
    path: 'friends',
    component: () => import('@/views/Friend/FriendHome.vue'),
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
        component: () => import('@/views/Friend/FriendSearch.vue'),
        meta: { theme: 'friend' }
      },
      {
        path: 'chatList',
        component: () => import('@/views/Chat/ChatRoomList.vue'),
        meta: { theme: 'friend' }
      }
    ]
  }
]

export default routes
