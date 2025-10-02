import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import AuthRouting from "./AuthRouting"
import MyWorldRouting from "./MyWorldRouting"
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
  ...ProfileRouting
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
