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
        component: () => import('@/views/Minihome/Minihome.vue')
      },

      {
        path: 'guestboard',
        component: () => import('@/views/Guestboard/Guestboard.vue'),
        meta: { theme: 'guestboard' }

      },
      {
        path: 'profile',
        component: () => import('@/views/Profile/ProfileView.vue'),
        meta: { theme: 'profile' }
      },
      {
        path: 'jukebox',
        component: () => import('@/views/Jukebox/Jukebox.vue'),
        meta: { theme: 'jukebox' }
      },
      {
        path: 'friend',
        component: () => import('@/views/Friend/FriendHome.vue'),
        redirect: to => `/myworld/${to.params.account}/friends/list`,
        meta: { theme: 'friend' }
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