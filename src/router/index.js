import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import LoginRouting from "./LoginRouting"
import MyPageRouting from "./MyPageRouting"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...ThemeTestRouting,
  ...LoginRouting,
  ...MyPageRouting
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
