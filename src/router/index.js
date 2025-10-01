import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import LoginRouting from "./LoginRouting"
import DiaryRouting from "./DiaryRouting"
import MyPageRouting from "./MyPageRouting"
import AuthRouting from "./AuthRouting"
import MyWorldRouting from "./MyWorldRouting"
import FriendRouting from "./FriendRouting"

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
  ...DiaryRouting
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
