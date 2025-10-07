import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/LandingPage.vue'
import ThemeTestRouting from "./ThemeTestRouting"
import AuthRouting from "./AuthRouting"
import MyWorldRouting from "./MyWorldRouting"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  ...ThemeTestRouting,
  ...AuthRouting,
  ...MyWorldRouting,
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
