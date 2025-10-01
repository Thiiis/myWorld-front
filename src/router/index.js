import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import DiaryRouting from "./DiaryRouting"
import AuthRouting from "./AuthRouting"
import MyWorldRouting from "./MyWorldRouting"
import FriendRouting from "./FriendRouting"
import ProfileRouting from "./ProfileRouting"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...ThemeTestRouting,
  ...AuthRouting,
  ...MyWorldRouting,
  ...FriendRouting,
  ...ProfileRouting,
  ...DiaryRouting
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
