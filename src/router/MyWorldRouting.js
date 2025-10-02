import DiaryRouting from './DiaryRouting'
import JukeboxRouting from './JukeboxRouting'

const routes = [
  {
    path: '/myworld/:account',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Home/Home.vue')
      },

      {
        path: 'guestboard',
        component: () => import('@/views/Guestboard/Guestboard.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/Profile/ProfileView.vue')
      },
      {
        path: 'jukebox',
        component: () => import('@/views/Jukebox/Jukebox.vue')
      },
      {
        path: 'friend',
        component: () => import('@/views/Friend/FriendHome.vue')
      },
    ...DiaryRouting,
    ...JukeboxRouting

    ]
  }
]

export default routes