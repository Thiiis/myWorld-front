import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import LoginRouting from "./LoginRouting"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...ThemeTestRouting,
  ...LoginRouting
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
