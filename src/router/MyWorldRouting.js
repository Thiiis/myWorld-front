import FriendRouting from './FriendRouting'
import DiaryRouting from './DiaryRouting'
import JukeboxRouting from './JukeboxRouting'
import MinihomeRouting from './MinihomeRouting'
import ProfileRouting from './ProfileRouting'
import Guestboard from '@/views/Guestboard/Guestboard.vue'

const routes = [
  {
    path: '/myworld/:account',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: 'minihome',
        alias: '',
        name: 'minihome',
        component: () => import('@/views/Minihome/Minihome.vue')
      },

      {
        path: 'guestboard',
        name: 'guestboard',
        component: () => import('@/views/Guestboard/Guestboard.vue')
      },
      {
        path: 'profile',
        name: 'profile', // 👈 'profile' 키와 연결됩니다.
        component: () => import('@/views/Profile/ProfileView.vue')
      },
      {
        path: 'jukebox',
        name: 'jukebox',
        component: () => import('@/views/Jukebox/Jukebox.vue')
      },
      {
        path: 'friend',
        name: 'friend',
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