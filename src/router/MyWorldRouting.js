import FriendRouting from './FriendRouting'
import DiaryRouting from './DiaryRouting'
import JukeboxRouting from './JukeboxRouting'
import MinihomeRouting from './MinihomeRouting'
import ProfileRouting from './ProfileRouting'

const routes = [
  {
    path: '/myworld/:account',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: 'minihome',
        alias: '',
        component: () => import('@/views/Minihome/Minihome.vue')
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
    ...JukeboxRouting,
    ...FriendRouting,
    ...MinihomeRouting,
    ...ProfileRouting

    ]
  }
]

export default routes